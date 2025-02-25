
import { useState, useEffect } from "react";
import { LiveSession } from "../../../types";
import { SessionInfoSlide } from "./slides/SessionInfoSlide";
import { ActiveQuestionSlide } from "./slides/ActiveQuestionSlide";
import { PresentationLayout } from "./components/PresentationLayout";
import { PresentationControls } from "./components/PresentationControls";
import { usePresentationNavigation } from "./hooks/usePresentationNavigation";
import { useLiveResponses } from "./hooks/useLiveResponses";
import "./styles.css";

interface PresentationViewProps {
  session: LiveSession;
}

export function PresentationView({ session }: PresentationViewProps) {
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  
  const {
    currentSlide,
    setCurrentSlide,
    isFullscreen,
    toggleFullscreen,
    handleBack,
    totalSlides
  } = usePresentationNavigation();

  const { responses, participants } = useLiveResponses(session.id);

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
      
      <ActiveQuestionSlide
        questions={activeQuestions}
        responses={responses}
        isActive={currentSlide === 1}
      />
    </PresentationLayout>
  );
}
