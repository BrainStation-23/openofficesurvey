
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ActiveQuestion, ParticipantInfo } from "../types";
import { CompletedQuestion } from "../types/completed-questions";
import { useResponseSubmission } from "./useResponseSubmission";
import { useSessionSubscription } from "./useSessionSubscription";

export interface LobbyParticipant {
  participant_id: string;
  display_name: string;
  joined_at: string;
}

function convertToActiveQuestion(dbQuestion: any): ActiveQuestion | null {
  if (!dbQuestion) return null;
  
  try {
    const questionData = typeof dbQuestion.question_data === 'string' 
      ? JSON.parse(dbQuestion.question_data)
      : dbQuestion.question_data;

    return {
      id: dbQuestion.id,
      question_key: dbQuestion.question_key,
      question_data: {
        title: questionData.title,
        type: questionData.type,
        choices: questionData.choices
      },
      session_id: dbQuestion.session_id,
      status: dbQuestion.status,
      display_order: dbQuestion.display_order
    };
  } catch (error) {
    console.error("Error converting question data:", error);
    return null;
  }
}

export function useLiveSession(joinCode: string) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<ActiveQuestion | null>(null);
  const [participantInfo, setParticipantInfo] = useState<ParticipantInfo | null>(null);
  const [questionResponses, setQuestionResponses] = useState<any[]>([]);
  const [participants, setParticipants] = useState<LobbyParticipant[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<CompletedQuestion[]>([]);

  const { submitResponse: submitResponseBase } = useResponseSubmission(sessionId);

  useEffect(() => {
    const storedInfo = localStorage.getItem(`live_session_${joinCode}`);
    if (!storedInfo) {
      navigate(`/live/${joinCode}/join`);
      return;
    }
    setParticipantInfo(JSON.parse(storedInfo));
  }, [joinCode, navigate]);

  const handleQuestionUpdate = useCallback((question: ActiveQuestion | null) => {
    setActiveQuestion(question);
    setHasSubmitted(false);
    if (!question) {
      setQuestionResponses([]);
    }
  }, []);

  const handleResponsesUpdate = useCallback((responses: any[]) => {
    setQuestionResponses(responses);
  }, []);

  useSessionSubscription(
    sessionId,
    activeQuestion,
    handleQuestionUpdate,
    handleResponsesUpdate
  );

  const fetchCompletedQuestions = useCallback(async () => {
    if (!sessionId || !participantInfo) return;

    const { data: questions, error } = await supabase
      .from("live_session_questions")
      .select(`
        *,
        responses:live_session_responses(*)
      `)
      .eq("session_id", sessionId)
      .eq("status", "completed")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching completed questions:", error);
      return;
    }

    const convertedQuestions: CompletedQuestion[] = questions
      .map(q => {
        const convertedQuestion = convertToActiveQuestion(q);
        if (!convertedQuestion) return null;

        return {
          ...convertedQuestion,
          responses: q.responses || [],
          completedAt: q.disabled_at || q.updated_at
        };
      })
      .filter((q): q is CompletedQuestion => q !== null);

    setCompletedQuestions(convertedQuestions);
  }, [sessionId, participantInfo]);

  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`questions_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'live_session_questions',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          if (payload.new.status === 'completed') {
            fetchCompletedQuestions();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, fetchCompletedQuestions]);

  useEffect(() => {
    fetchCompletedQuestions();
  }, [fetchCompletedQuestions]);

  useEffect(() => {
    const checkExistingResponse = async () => {
      if (!sessionId || !activeQuestion || !participantInfo) return;

      const { data: existingResponse } = await supabase
        .from("live_session_responses")
        .select("id")
        .match({
          session_id: sessionId,
          participant_id: participantInfo.participantId,
          question_key: activeQuestion.question_key
        })
        .single();

      if (existingResponse) {
        setHasSubmitted(true);
      }
    };

    checkExistingResponse();
  }, [sessionId, activeQuestion, participantInfo]);

  useEffect(() => {
    if (!sessionId || !participantInfo) return;

    const channel = supabase.channel(`presence_${sessionId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState() as Record<string, LobbyParticipant[]>;
        const allParticipants = Object.values(state).flat();
        setParticipants(allParticipants);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        toast({
          description: `${newPresences[0].display_name} joined the session`,
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            participant_id: participantInfo.participantId,
            display_name: participantInfo.displayName,
            joined_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, participantInfo, toast]);

  useEffect(() => {
    const setupSession = async () => {
      try {
        const { data: session, error: sessionError } = await supabase
          .from("live_survey_sessions")
          .select("id, status")
          .eq("join_code", joinCode)
          .single();

        if (sessionError || !session) {
          throw new Error("Session not found");
        }

        if (session.status === "ended") {
          throw new Error("This session has ended");
        }

        setSessionId(session.id);

        const { data: question, error: questionError } = await supabase
          .from("live_session_questions")
          .select("*")
          .eq("session_id", session.id)
          .eq("status", "active")
          .single();

        if (!questionError && question) {
          const convertedQuestion = convertToActiveQuestion(question);
          if (convertedQuestion) {
            setActiveQuestion(convertedQuestion);

            const { data: responses } = await supabase
              .from("live_session_responses")
              .select("*")
              .eq("session_id", session.id)
              .eq("question_key", question.question_key);

            setQuestionResponses(responses || []);
          }
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Unable to join session",
          variant: "destructive",
        });
        navigate("/live");
      } finally {
        setIsLoading(false);
      }
    };

    setupSession();
  }, [joinCode, toast, navigate]);

  const submitResponse = async (response: string) => {
    if (!activeQuestion || !participantInfo) return false;

    const { data: existingResponse } = await supabase
      .from("live_session_responses")
      .select("id")
      .match({
        session_id: sessionId,
        participant_id: participantInfo.participantId,
        question_key: activeQuestion.question_key
      })
      .single();

    if (existingResponse) {
      setHasSubmitted(true);
      return true;
    }

    const success = await submitResponseBase(response, activeQuestion, participantInfo);
    if (success) {
      setHasSubmitted(true);
    }
    return success;
  };

  return {
    isLoading,
    sessionId,
    activeQuestion,
    participantInfo,
    questionResponses,
    participants,
    submitResponse,
    hasSubmitted,
    completedQuestions
  };
}
