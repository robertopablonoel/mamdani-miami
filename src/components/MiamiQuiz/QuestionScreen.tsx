import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { QUIZ_COPY } from '@/content/quiz-copy';
import type { QuizAnswers } from '@/types/quiz';
import { useState } from 'react';

interface Props {
  step: number;
  answers: QuizAnswers;
  onAnswer: (key: string, value: string) => void;
}

export default function QuestionScreen({ step, onAnswer }: Props) {
  const screenData = QUIZ_COPY.screens[step - 1];
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleSubmit = () => {
    if (!selectedValue) return;

    // Map step to answer key
    const keyMap: Record<number, string> = {
      1: 'housing_status',
      2: 'monthly_cost',
      3: 'income_bracket',
      4: 'frustration',
      5: 'benefit',
      6: 'timeline',
      7: 'concern',
    };

    const key = keyMap[step];
    onAnswer(key, selectedValue);
  };

  const handleSkip = () => {
    onAnswer('concern', 'none');
  };

  return (
    <Card className="shadow-premium border-0 mt-4 bg-white">
      <CardContent className="p-8 md:p-12">
        <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-3">
          {screenData.h1}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mb-6">
          {screenData.subhead}
        </p>

        <p className="text-lg font-medium mb-4">{screenData.question}</p>

        <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
          <div className="space-y-3">
            {screenData.options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary hover:bg-accent cursor-pointer transition-colors"
                onClick={() => setSelectedValue(option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer flex-1 text-base">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedValue}
            className="w-full"
          >
            {screenData.button}
          </Button>

          {step === 7 && screenData.skipButton && (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="w-full text-muted-foreground"
            >
              {screenData.skipButton}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
