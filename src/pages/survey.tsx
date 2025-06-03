import { useState, useEffect } from "react";
import { SurveyHeader } from "@/components/survey/SurveyHeader";
import { ProgressBar } from "@/components/survey/ProgressBar";
import { WelcomeStep } from "@/components/survey/steps/WelcomeStep";
import { ToneStep } from "@/components/survey/steps/ToneStep";
import { StyleStep } from "@/components/survey/steps/StyleStep";
import { AudienceStep } from "@/components/survey/steps/AudienceStep";
import { ContentTypesStep } from "@/components/survey/steps/ContentTypesStep";
import { PreferencesStep } from "@/components/survey/steps/PreferencesStep";
import { WritingSampleStep } from "@/components/survey/steps/WritingSampleStep";
import { SummaryStep } from "@/components/survey/steps/SummaryStep";
import { useSurvey } from "@/hooks/useSurvey";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_STEPS = 8;

export default function Survey() {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const {
    surveyData,
    updateSurveyData,
    saveSurveyResponse,
    isLoading,
    isSaving
  } = useSurvey(sessionId);

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
    }
  ;

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 2:
        if (!surveyData.tone) {
          alert('Please select a writing tone before continuing.');
          return false;
        }
        break;
      case 4:
        if (surveyData.audiences.length === 0) {
          alert('Please select at least one audience type.');
          return false;
        }
        break;
      case 5:
        if (surveyData.contentTypes.length === 0) {
          alert('Please select at least one content type.');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  const handleStartOver = () => {
    if (confirm('Are you sure you want to start over? All your current selections will be lost.')) {
      setCurrentStep(1);
      updateSurveyData({
        tone: '',
        style: {
          sentenceLength: 3,
          vocabulary: 3,
          formality: 3,
          examples: 3
        },
        audiences: [],
        contentTypes: [],
        personality: [],
        preferences: {
          useBulletPoints: false,
          useHeaders: false,
          useCTA: false
        },
        industry: '',
        customInstructions: '',
        audienceContext: ''
      });
    }
  };

  const stepVariants = {
    enter: {
      x: 300,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: -300,
      opacity: 0
    }
  };

  const renderStep = () => {
    const stepProps = {
      surveyData,
      updateSurveyData,
      onNext: handleNext,
      onPrevious: previousStep,
      onStartOver: handleStartOver,
      sessionId,
      saveSurveyResponse,
      isSaving,
      isLoading
    };

    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={nextStep} />;
      case 2:
        return <ToneStep {...stepProps} />;
      case 3:
        return <StyleStep {...stepProps} />;
      case 4:
        return <AudienceStep {...stepProps} />;
      case 5:
        return <ContentTypesStep {...stepProps} />;
      case 6:
        return <PreferencesStep {...stepProps} />;
      case 7:
        return <WritingSampleStep {...stepProps} />;
      case 8:
        return <SummaryStep 
          surveyData={surveyData}
          sessionId={sessionId}
          onStartOver={handleStartOver}
        />;
      default:
        return <WelcomeStep onNext={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <SurveyHeader />
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="bg-white rounded-xl shadow-lg p-8 mb-6"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
