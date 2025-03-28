
import { LiveSession } from "../../../types";
import { SessionInfoSlide } from "./slides/SessionInfoSlide";
import { QuestionSlide } from "./slides/QuestionSlide";
import { PresentationLayout } from "./components/PresentationLayout";
import { PresentationControls } from "./components/PresentationControls";
import { usePresentationNavigation } from "./hooks/usePresentationNavigation";
import { useLiveResponses } from "./hooks/useLiveResponses";
import { useEffect } from "react";
import "./styles.css";

interface PresentationViewProps {
  session: LiveSession;
}

export function PresentationView({ session }: PresentationViewProps) {
  const {
    currentSlide,
    setCurrentSlide,
    isFullscreen,
    toggleFullscreen,
    handleBack,
    totalSlides,
    setTotalSlides
  } = usePresentationNavigation();

  const { getQuestionResponses, participants, activeQuestions } = useLiveResponses(session.id);

  // Get the currently active question based on slide index
  const currentQuestion = currentSlide === 0 ? null : activeQuestions[currentSlide - 1];

  // Update total slides when questions change
  useEffect(() => {
    setTotalSlides(activeQuestions.length + 1); // +1 for the info slide
    console.log("Total slides updated:", activeQuestions.length + 1);
  }, [activeQuestions.length, setTotalSlides]);

  // Debug logging for slide changes
  useEffect(() => {
    console.log("Current slide:", currentSlide);
    console.log("Current question:", currentQuestion);
  }, [currentSlide, currentQuestion]);

  return (
    <PresentationLayout 
      progress={((currentSlide + 1) / totalSlides) * 100}
      isFullscreen={isFullscreen}
    >
      <PresentationControls
        onBack={handleBack}
        onPrevious={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
        onNext={() => setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))}
        onFullscreen={toggleFullscreen}
        isFirstSlide={currentSlide === 0}
        isLastSlide={currentSlide === totalSlides - 1}
        isFullscreen={isFullscreen}
        currentSlide={currentSlide + 1}
        totalSlides={totalSlides}
      />
      
      <SessionInfoSlide 
        session={session}
        participants={participants}
        isActive={currentSlide === 0}
      />
      
      {activeQuestions.map((question, index) => {
        const isSlideActive = currentSlide === index + 1;
        console.log(`Question ${index + 1} active state:`, isSlideActive);
        
        return (
          <QuestionSlide
            key={question.id}
            question={question}
            responses={getQuestionResponses(question.question_key)}
            isActive={isSlideActive}
            isSessionActive={session.status === "active"}
            allowStatusChange={session.status === "active" && isSlideActive}
          />
        );
      })}
    </PresentationLayout>
  );
}
