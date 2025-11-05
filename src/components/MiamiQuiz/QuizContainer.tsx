import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import type { QuizAnswers, QuizSession } from '@/types/quiz';
import QuestionScreen from './QuestionScreen';
import ProgressBar from './ProgressBar';
import LeadCaptureForm from './LeadCaptureForm';
import ResultsView from './ResultsView';
import { trackEvent } from '@/lib/analytics';

export default function QuizContainer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [sessionData, setSessionData] = useState<QuizSession | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    const session_id = uuidv4();

    // Extract UTM params from URL
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source') || undefined;
    const utm_medium = urlParams.get('utm_medium') || undefined;
    const utm_campaign = urlParams.get('utm_campaign') || undefined;
    const utm_content = urlParams.get('utm_content') || undefined;

    const sessionPayload: QuizSession = {
      session_id,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      referrer: document.referrer || undefined,
      device_type: getDeviceType(),
      browser: getBrowser(),
    };

    // Insert session into Supabase
    try {
      const { error } = await supabase.from('quiz_sessions').insert([sessionPayload]);
      if (error) throw error;

      setSessionData(sessionPayload);
      trackEvent('quiz_start', { session_id, utm_source, utm_campaign });
    } catch (error) {
      console.error('Failed to initialize quiz session:', error);
    }
  };

  const handleAnswer = async (key: string, value: string) => {
    const updatedAnswers = { ...answers, [key]: value };
    setAnswers(updatedAnswers);

    // Save answer to Supabase
    if (sessionData) {
      try {
        // First get the UUID for this session
        const { data: sessionRecord } = await supabase
          .from('quiz_sessions')
          .select('id')
          .eq('session_id', sessionData.session_id)
          .single();

        if (sessionRecord) {
          await supabase.from('quiz_answers').insert([
            {
              session_id: sessionRecord.id,
              step: currentStep,
              question_key: key,
              answer_value: value,
            },
          ]);
        }

        trackEvent('quiz_step', { step: currentStep, key, value });
      } catch (error) {
        console.error('Failed to save answer:', error);
      }
    }

    // Advance to next step or show lead capture
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowLeadCapture(true);
    }
  };

  const handleLeadSubmit = () => {
    setShowLeadCapture(false);
    setShowResults(true);
  };

  // Helper functions
  function getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
    return 'desktop';
  }

  function getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  }

  if (!sessionData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return <ResultsView answers={answers} sessionData={sessionData} />;
  }

  if (showLeadCapture) {
    return (
      <LeadCaptureForm
        answers={answers}
        sessionData={sessionData}
        onSubmit={handleLeadSubmit}
      />
    );
  }

  return (
    <div className="min-h-screen gradient-premium py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <ProgressBar currentStep={currentStep} totalSteps={7} />
        <QuestionScreen
          step={currentStep}
          answers={answers}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
}
