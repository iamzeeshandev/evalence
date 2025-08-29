"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/lib/auth";
import { useSaveAttemptAnswerMutation } from "@/services/rtk-query/attempt-answer/attempt-answer-api";
import { useSubmitTestAttemptMutation } from "@/services/rtk-query/test-attempt/test-attempt-api";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface TestTakingInterfaceProps {
  test: any;
  onClose: () => void;
}

export function TestTakingInterface({
  test,
  onClose,
}: TestTakingInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(test.duration * 60); // Convert to seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { user } = useAuth();

  const [saveTestAttempt] = useSubmitTestAttemptMutation();

  const [saveAttemptAnswer] = useSaveAttemptAnswerMutation();
  const attemptId = sessionStorage.getItem("currentTestAttempt") || "";

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmitTest();
    }
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionIndex: number, optionIndex: string) => {
    setAnswers({ ...answers, [questionIndex]: optionIndex });
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      const payload = {
        attemptId: attemptId,
        questionId: test.questions[currentQuestionIndex].id,
        userId: user?.id || "",
        selectedOptionIds: [answers[currentQuestionIndex]],
        timeSpentIncrementSec: 120000,
      };
      await saveAttemptAnswer(payload);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    setIsSubmitted(true);
    setShowResults(true);
    // Here you would typically send answers to your API
    const payload = {
      attemptId: attemptId,
      finalTimeSpentSec: timeRemaining || 1,
    };
    saveTestAttempt(payload);
    console.log("Test submitted with answers:", answers);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    test.questions.forEach((question: any, index: number) => {
      totalPoints += question.points;
      const userAnswer = answers[index];
      if (userAnswer !== undefined) {
        const selectedOption = question.options[Number.parseInt(userAnswer)];
        if (selectedOption && selectedOption.isCorrect) {
          correctAnswers++;
          earnedPoints += question.points;
        }
      }
    });

    return {
      correctAnswers,
      totalQuestions: test.questions.length,
      earnedPoints,
      totalPoints,
      percentage:
        totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0,
    };
  };

  console.log("Test results:", calculateScore());

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Test Completed!</CardTitle>
            <CardDescription>Here are your results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">
                {score.percentage}%
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">
                    {score.correctAnswers}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {score.totalQuestions - score.correctAnswers}
                  </div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{score.earnedPoints}</div>
                  <div className="text-sm text-muted-foreground">
                    Points Earned
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{score.totalPoints}</div>
                  <div className="text-sm text-muted-foreground">
                    Total Points
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Question Review</h3>
              {test.questions.map((question: any, index: number) => {
                const userAnswer = answers[index];
                const isCorrect =
                  userAnswer !== undefined &&
                  question.options[Number.parseInt(userAnswer)]?.isCorrect;

                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">Question {index + 1}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {question.text}
                        </p>
                        <div className="space-y-1">
                          {question.options.map(
                            (option: any, optIndex: number) => {
                              const isUserAnswer =
                                userAnswer === optIndex.toString();
                              const isCorrectOption = option.isCorrect;

                              return (
                                <div
                                  key={optIndex}
                                  className={`text-sm p-2 rounded ${
                                    isCorrectOption
                                      ? "bg-green-100 text-green-800 border border-green-200"
                                      : isUserAnswer && !isCorrectOption
                                      ? "bg-red-100 text-red-800 border border-red-200"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  {option.text}
                                  {isCorrectOption && " ✓"}
                                  {isUserAnswer &&
                                    !isCorrectOption &&
                                    " ✗ (Your answer)"}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button onClick={onClose} className="w-full">
              Close Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      {/* Test Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{test.title}</CardTitle>
              <CardDescription>
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span
                  className={
                    timeRemaining < 300 ? "text-red-500 font-bold" : ""
                  }
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Badge variant="outline">
                {answeredQuestions}/{test.questions.length} answered
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
              Question {currentQuestionIndex + 1}
            </CardTitle>
            <Badge>{currentQuestion.points} points</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg">{currentQuestion.text}</p>
          <div className="relative inline-block w-full">
            <img
              src={currentQuestion.imageUrl || "/placeholder.svg"}
              alt="Question"
              className="max-w-xl max-h-248 rounded-lg border"
            />
          </div>
          <RadioGroup
            value={answers[currentQuestionIndex] || ""}
            onValueChange={(value) =>
              handleAnswerChange(currentQuestionIndex, value)
            }
          >
            {[...currentQuestion.options]
              ?.sort((a, b) => a.text.localeCompare(b.text))
              .map((option: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <RadioGroupItem
                      value={option.id}
                      // value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option.text}
                    </Label>
                  </div>
                );
              })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end items-center">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="hidden"
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentQuestionIndex === test.questions.length - 1 ? (
            <Button
              onClick={handleSubmitTest}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit Assessment
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>Next</Button>
          )}
        </div>
      </div>

      {/* Question Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Question Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {test.questions.map((_: any, index: number) => (
              <Button
                key={index}
                variant={
                  currentQuestionIndex === index
                    ? "default"
                    : answers[index] !== undefined
                    ? "secondary"
                    : "outline"
                }
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className="aspect-square p-0"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
