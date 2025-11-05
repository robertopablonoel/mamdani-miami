import { useEffect } from 'react';
import QuizContainer from '@/components/MiamiQuiz/QuizContainer';
import { trackPageView } from '@/lib/analytics';

export default function MiamiQuizPage() {
  useEffect(() => {
    trackPageView('/move-to-miami', 'Miami Relocation Quiz');
  }, []);

  return <QuizContainer />;
}
