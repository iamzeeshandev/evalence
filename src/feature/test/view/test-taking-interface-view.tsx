"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/lib/auth";
import { useSaveAttemptAnswerMutation } from "@/services/rtk-query/attempt-answer/attempt-answer-api";
import { useSubmitTestAttemptMutation } from "@/services/rtk-query/test-attempt/test-attempt-api";
import { Option, TestResponse } from "@/services/rtk-query/tests/tests-type";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface TestTakingInterfaceProps {
  test: TestResponse;
  onClose: () => void;
}

export function TestTakingInterface({
  test,
  onClose,
}: TestTakingInterfaceProps) {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  const [saveAttemptAnswer] = useSaveAttemptAnswerMutation();
  const [submitTestAttempt] = useSubmitTestAttemptMutation();

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
  const attemptId = sessionStorage.getItem("currentTestAttempt");

  const handleAnswerChange = (value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const handleNextQuestion = async () => {
    if (!attemptId || !user) return;

    try {
      // Save current answer
      const selectedOptionIds = Array.isArray(answers[currentQuestionIndex])
        ? answers[currentQuestionIndex]
        : answers[currentQuestionIndex]
        ? [answers[currentQuestionIndex] as string]
        : [];

      const payload = {
        attemptId,
        questionId: currentQuestion.id,
        userId: user.id,
        selectedOptionIds,
        timeSpentIncrementSec: timeSpent,
      };

      await saveAttemptAnswer(payload).unwrap();
      setTimeSpent(0); // Reset timer for next question

      // Move to next question or complete test
      if (isLastQuestion) {
        await handleSubmitTest();
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to save answer:", error);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    if (!attemptId) return;

    setIsSubmitting(true);
    try {
      const payload = {
        attemptId,
        finalTimeSpentSec: timeSpent,
      };

      await submitTestAttempt(payload).unwrap();
      setTestCompleted(true);

      // Clean up session storage
      setTimeout(() => {
        sessionStorage.removeItem("currentTestAttempt");
      }, 2000);
    } catch (error) {
      console.error("Failed to submit test:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestionOptions = () => {
    if (currentQuestion.type === "single") {
      return (
        <RadioGroup
          value={(answers[currentQuestionIndex] as string) || ""}
          onValueChange={handleAnswerChange}
          className="space-y-2 gap-0"
        >
          {[...currentQuestion.options]
            ?.sort((a, b) => a.text.localeCompare(b.text))
            ?.map((option: Option, index: number) => (
              <div
                key={index}
                // className="flex items-center space-x-2"
                className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50"
              >
                <RadioGroupItem
                  value={option.id || `option-${index}`}
                  id={`option-${index}`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {option.text}
                </Label>
              </div>
            ))}
        </RadioGroup>
      );
    } else if (currentQuestion.type === "multiple") {
      const selectedValues = (answers[currentQuestionIndex] as string[]) || [];

      return (
        <div className="space-y-3">
          {currentQuestion.options.map((option: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`option-${index}`}
                checked={selectedValues.includes(
                  option.id || `option-${index}`
                )}
                onCheckedChange={(checked) => {
                  const newValues = checked
                    ? [...selectedValues, option.id || `option-${index}`]
                    : selectedValues.filter(
                        (v) => v !== (option.id || `option-${index}`)
                      );

                  handleAnswerChange(newValues);
                }}
              />
              <Label
                htmlFor={`option-${index}`}
                className="flex-1 cursor-pointer"
              >
                {option.text}
              </Label>
            </div>
          ))}
        </div>
      );
    }
  };

  if (testCompleted) {
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <Badge className="text-lg px-4 py-2 bg-green-100 text-green-800 border-green-200">
            Test Completed Successfully
          </Badge>
        </div>
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p className="text-muted-foreground mb-6">
          Your assessment has been submitted successfully.
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with progress and timer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">
            Question {currentQuestionIndex + 1} of {test.questions.length}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Clock className="h-4 w-4 mr-1" />
            Time spent on this question: {Math.floor(timeSpent / 60)}:
            {(timeSpent % 60).toString().padStart(2, "0")}
          </div>
        </div>
        <Badge variant="outline" className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Total time: {Math.floor(timeSpent / 60)}:
          {(timeSpent % 60).toString().padStart(2, "0")}
        </Badge>
      </div>

      <Progress
        value={((currentQuestionIndex + 1) / test.questions.length) * 100}
      />

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Badge variant="secondary" className="mr-2">
              {currentQuestion.type === "single"
                ? "Single Choice"
                : "Multiple Choice"}
            </Badge>
            {/* <span>{currentQuestion.points} point(s)</span> */}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative inline-block w-full">
            <img
              src={currentQuestion.imageUrl || "/placeholder.svg"}
              alt="Question"
              className="w-full max-w-xl max-h-248 rounded-lg border"
            />
          </div>
          {renderQuestionOptions()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0 || isSubmitting}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <Button
          onClick={handleNextQuestion}
          disabled={!answers[currentQuestionIndex] || isSubmitting}
        >
          {isSubmitting ? (
            "Submitting..."
          ) : isLastQuestion ? (
            "Submit Test"
          ) : (
            <>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
