import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { QUIZ_COPY } from '@/content/quiz-copy';
import type { QuizAnswers } from '@/types/quiz';
import { useState } from 'react';

interface Props {
  step: number;
  answers: QuizAnswers;
  onAnswer: (key: string, value: string | string[]) => void;
}

export default function QuestionScreen({ step, onAnswer }: Props) {
  const screenData = QUIZ_COPY.screens[step - 1];
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const isMultiSelect = screenData.multiSelect;

  const handleSubmit = () => {
    if (isMultiSelect) {
      if (selectedValues.length === 0) return;
    } else {
      if (!selectedValue) return;
    }

    // Map step to answer key
    const keyMap: Record<number, string> = {
      1: 'frustration',
      2: 'monthly_cost',
      3: 'income_bracket',
      4: 'housing_status',
      5: 'benefit',
      6: 'timeline',
    };

    const key = keyMap[step];
    onAnswer(key, isMultiSelect ? selectedValues : selectedValue);
  };

  const toggleCheckbox = (value: string) => {
    setSelectedValues((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  return (
    <Card className="shadow-premium border-0 mt-4 bg-white">
      <CardContent className="p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-2">
          {screenData.h1}
        </h1>
        <p className="text-base text-muted-foreground mb-4">
          {screenData.subhead}
        </p>

        <p className="text-lg font-medium mb-3">{screenData.question}</p>

        {isMultiSelect ? (
          <div className="space-y-2">
            {screenData.options.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedValues.includes(option.value)
                    ? 'border-primary bg-accent'
                    : 'border-gray-200 hover:border-primary hover:bg-accent'
                }`}
                onClick={() => toggleCheckbox(option.value)}
              >
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={() => toggleCheckbox(option.value)}
                  id={option.value}
                />
                <Label htmlFor={option.value} className="cursor-pointer flex-1 text-base leading-snug">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
            <div className="space-y-2">
              {screenData.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:border-primary hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => setSelectedValue(option.value)}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="cursor-pointer flex-1 text-base leading-snug">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}

        <div className="mt-6">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isMultiSelect ? selectedValues.length === 0 : !selectedValue}
            className="w-full h-12"
          >
            {screenData.button}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
