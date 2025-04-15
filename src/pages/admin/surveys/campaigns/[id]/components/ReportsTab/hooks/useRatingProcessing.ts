
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NpsData, RatingResponseData, SatisfactionData } from "../../PresentationView/types/responses";
import { ProcessedResponse } from "../hooks/useResponseProcessing";
import { ComparisonDimension } from "../types/comparison";
import { isNpsQuestion, isSatisfactionQuestion } from "../../PresentationView/types/questionTypes";

/**
 * Process NPS rating data for a question
 */
export const processNpsData = (answers: number[]): NpsData => {
  const validAnswers = answers.filter(rating => typeof rating === "number");
  const total = validAnswers.length;
  
  if (total === 0) {
    return {
      detractors: 0,
      passives: 0,
      promoters: 0,
      total: 0,
      npsScore: 0
    };
  }

  const detractors = validAnswers.filter(r => r <= 6).length;
  const passives = validAnswers.filter(r => r > 6 && r <= 8).length;
  const promoters = validAnswers.filter(r => r > 8).length;

  const npsScore = Math.round(
    ((promoters - detractors) / total) * 100
  );

  return {
    detractors,
    passives,
    promoters,
    total,
    npsScore
  };
};

/**
 * Process satisfaction rating data for a question
 */
export const processSatisfactionData = (answers: number[]): SatisfactionData => {
  const validAnswers = answers.filter(
    (rating) => typeof rating === "number" && rating >= 1 && rating <= 5
  );
  
  const total = validAnswers.length;
  
  if (total === 0) {
    return {
      unsatisfied: 0,
      neutral: 0,
      satisfied: 0,
      total: 0,
      median: 0
    };
  }

  const unsatisfied = validAnswers.filter(r => r <= 2).length;
  const neutral = validAnswers.filter(r => r === 3).length;
  const satisfied = validAnswers.filter(r => r >= 4).length;

  const calculateMedian = (ratings: number[]) => {
    if (ratings.length === 0) return 0;
    const sorted = [...ratings].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  };

  return {
    unsatisfied,
    neutral,
    satisfied,
    total,
    median: calculateMedian(validAnswers)
  };
};

/**
 * Custom hook to process rating data and handle comparisons
 */
export function useRatingProcessing(
  responses: ProcessedResponse[],
  questionName: string,
  question: any,
  dimension: ComparisonDimension
) {
  const isNps = isNpsQuestion(question);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch supervisor data if dimension is "supervisor"
  const fetchSupervisorData = async (campaignId: string, instanceId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!campaignId || !instanceId) {
        throw new Error("Campaign or instance ID not provided");
      }
      
      const { data: supervisorData, error: rpcError } = await supabase.rpc(
        'get_supervisor_satisfaction',
        {
          p_campaign_id: campaignId,
          p_instance_id: instanceId,
          p_question_name: questionName
        }
      );
      
      if (rpcError) throw rpcError;
      
      return supervisorData.map((item: any) => ({
        dimension: item.dimension,
        unsatisfied: item.unsatisfied,
        neutral: item.neutral,
        satisfied: item.satisfied,
        total: item.total
      }));
    } catch (err) {
      console.error("Error fetching supervisor data:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch supervisor data'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Process regular rating comparison data
  const processComparisonData = () => {
    if (isNps) {
      const dimensionData = new Map<string, number[]>();

      responses.forEach((response) => {
        const questionData = response.answers[questionName];
        if (!questionData || typeof questionData.answer !== "number") return;

        const answer = questionData.answer;
        let dimensionValue = "Unknown";

        switch (dimension) {
          case "sbu":
            dimensionValue = response.respondent.sbu?.name || "Unknown";
            break;
          case "gender":
            dimensionValue = response.respondent.gender || "Unknown";
            break;
          case "location":
            dimensionValue = response.respondent.location?.name || "Unknown";
            break;
          case "employment_type":
            dimensionValue = response.respondent.employment_type?.name || "Unknown";
            break;
          case "level":
            dimensionValue = response.respondent.level?.name || "Unknown";
            break;
          case "employee_type":
            dimensionValue = response.respondent.employee_type?.name || "Unknown";
            break;
          case "employee_role":
            dimensionValue = response.respondent.employee_role?.name || "Unknown";
            break;
        }

        if (!dimensionData.has(dimensionValue)) {
          dimensionData.set(dimensionValue, []);
        }

        dimensionData.get(dimensionValue)!.push(answer);
      });

      return Array.from(dimensionData.entries()).map(([dimension, answers]) => {
        const npsData = processNpsData(answers);
        return {
          dimension,
          ...npsData
        };
      });
    } else {
      const dimensionData = new Map<string, number[]>();

      responses.forEach((response) => {
        const questionData = response.answers[questionName];
        if (!questionData || typeof questionData.answer !== "number") return;

        const answer = questionData.answer;
        let dimensionValue = "Unknown";

        switch (dimension) {
          case "sbu":
            dimensionValue = response.respondent.sbu?.name || "Unknown";
            break;
          case "gender":
            dimensionValue = response.respondent.gender || "Unknown";
            break;
          case "location":
            dimensionValue = response.respondent.location?.name || "Unknown";
            break;
          case "employment_type":
            dimensionValue = response.respondent.employment_type?.name || "Unknown";
            break;
          case "level":
            dimensionValue = response.respondent.level?.name || "Unknown";
            break;
          case "employee_type":
            dimensionValue = response.respondent.employee_type?.name || "Unknown";
            break;
          case "employee_role":
            dimensionValue = response.respondent.employee_role?.name || "Unknown";
            break;
        }

        if (!dimensionData.has(dimensionValue)) {
          dimensionData.set(dimensionValue, []);
        }

        dimensionData.get(dimensionValue)!.push(answer);
      });

      return Array.from(dimensionData.entries()).map(([dimension, answers]) => {
        const satisfactionData = processSatisfactionData(answers);
        return {
          dimension,
          ...satisfactionData
        };
      });
    }
  };

  useEffect(() => {
    const processDimensionData = async () => {
      // If this is the supervisor dimension, we need to fetch data from the backend
      if (dimension === "supervisor" && responses[0]?.answers[questionName]) {
        // Get the campaignId and instanceId from the first response
        const firstResponse = responses[0];
        if (!firstResponse) return;
        
        // Normally these would be passed as props, but we can try to extract from the URL in this implementation
        // Later, refine how we pass these values
        const urlParts = window.location.pathname.split('/');
        const campaignId = urlParts[urlParts.indexOf('campaigns') + 1];
        const instanceId = firstResponse.answers[questionName]?.instanceId || undefined;
        
        const supervisorData = await fetchSupervisorData(campaignId, instanceId);
        setData(supervisorData);
      } else {
        setData(processComparisonData());
      }
    };

    processDimensionData();
  }, [dimension, questionName, responses]);

  return { data, isLoading: loading, error, isNps };
}

/**
 * Process a question's answers for the main (non-comparison) view
 */
export function processRatingQuestion(
  answers: number[], 
  question: any
) {
  const isNps = isNpsQuestion(question);
  
  if (isNps) {
    // For NPS questions (0-10 scale)
    const ratingCounts: RatingResponseData = new Array(11).fill(0).map((_, rating) => ({
      rating,
      count: answers.filter(a => a === rating).length
    }));
    return {
      type: 'nps' as const,
      data: ratingCounts
    };
  } else {
    // For satisfaction questions (1-5 scale)
    return {
      type: 'satisfaction' as const,
      data: processSatisfactionData(answers)
    };
  }
}
