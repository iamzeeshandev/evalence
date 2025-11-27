"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Timer,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { 
  useStartTestAttemptMutation, 
  useGetTestAttemptByIdQuery,
  useSubmitTestAttemptMutation
} from "@/services/rtk-query/test-attempt/test-attempt-api";
import { useGetBatteryByIdQuery } from "@/services/rtk-query/battery/battery-api";
import { useGetAccessibleTestByIdQuery } from "@/services/rtk-query/tests/tests-apis";
import { useSaveAttemptAnswerMutation } from "@/services/rtk-query/attempt-answer/attempt-answer-api";
import { TestAttemptResponse } from "@/services/rtk-query/test-attempt/test-attempt-type";
import { Option, Question } from "@/services/rtk-query/tests/tests-type";

interface Answer {
  questionId: string;
  selectedOptionIds: string[];
}

export function TestQuestionView() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { authData } = useAuth();
  
  const id = params?.id as string;
  const batteryName = searchParams?.get("name") || "Unknown Battery";
  const mode = searchParams?.get("mode") || "battery"; // 'battery' or 'test'
  
  // Get user ID from auth context
  const userId = authData.user?.id;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(60 * 60); // 60 minutes in seconds
  const [isTestStarted, setIsTestStarted] = useState(true);
  const [isBatteryMode, setIsBatteryMode] = useState<boolean>(mode !== "test");
  const [testAttemptId, setTestAttemptId] = useState<string | null>(null);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false); // New state for test submission
  const [submissionError, setSubmissionError] = useState<string | null>(null); // New state for submission errors
  
  // Start test attempt mutation
  const [startTestAttempt, { isLoading: isStarting }] = useStartTestAttemptMutation();
  const [submitTestAttempt, { isLoading: isSubmitting }] = useSubmitTestAttemptMutation();
  const [saveAttemptAnswer, { isLoading: isSavingAnswer }] = useSaveAttemptAnswerMutation();
  
  // Get battery details
  const { data: batteryData, isLoading: isBatteryLoading, error: batteryError } = useGetBatteryByIdQuery(id, {
    skip: !id || !isBatteryMode,
  });
  
  // Get test details using the accessible endpoint
  const { data: testData, isLoading: isTestLoading, error: testError } = useGetAccessibleTestByIdQuery(id, {
    skip: !id || isBatteryMode,
  });
  
  // Determine if we should try test mode
  useEffect(() => {
    if (isBatteryMode && batteryError && 'status' in batteryError && batteryError.status === 404) {
      setIsBatteryMode(false);
    }
  }, [batteryError, isBatteryMode]);
  
  // Start test attempt when test/battery data is loaded
  useEffect(() => {
    const startAttempt = async () => {
      if (userId && !testAttemptId) {
        try {
          let testId;
          let batteryId = null;
          
          if (isBatteryMode && batteryData) {
            // For battery mode, use the first test ID from battery tests
            testId = batteryData.batteryTests?.[0]?.test?.id;
            batteryId = batteryData.id; // Include the battery ID
          } else if (!isBatteryMode && testData) {
            // For test mode, use the test ID directly
            testId = testData.id;
            // Check if this test is part of any battery
            if (testData.batteryTests && testData.batteryTests.length > 0) {
              // Use the first battery this test belongs to
              batteryId = testData.batteryTests[0].batteryId;
            }
          } else {
            return;
          }
          
          if (testId) {
            // Always send all three fields
            const payload = {
              testId,
              userId,
              batteryId, // Always include batteryId, even when null
            };
            
            const result = await startTestAttempt(payload).unwrap();
            setTestAttemptId(result.id);
          }
        } catch (error) {
          console.error("Failed to start test attempt:", error);
        }
      }
    };

    startAttempt();
  }, [userId, batteryData, testData, isBatteryMode, testAttemptId, startTestAttempt]);
  
  // Timer effect
  useEffect(() => {
    if (!isTestStarted || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isTestStarted, timeLeft]);
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Handle answer selection
  const handleAnswerSelect = async (questionId: string, optionId: string, isMultiSelect: boolean) => {
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
      
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev];
        
        if (isMultiSelect) {
          // For multi-select, toggle the option
          const selectedOptionIds = newAnswers[existingAnswerIndex].selectedOptionIds;
          const optionIndex = selectedOptionIds.indexOf(optionId);
          
          if (optionIndex >= 0) {
            // Remove option
            selectedOptionIds.splice(optionIndex, 1);
          } else {
            // Add option
            selectedOptionIds.push(optionId);
          }
        } else {
          // For single-select, replace with new option
          newAnswers[existingAnswerIndex].selectedOptionIds = [optionId];
        }
        
        return newAnswers;
      } else {
        // Add new answer
        return [...prev, { questionId, selectedOptionIds: [optionId] }];
      }
    });
    
    // Save answer to backend
    if (testAttemptId && userId) {
      try {
        const payload = {
          attemptId: testAttemptId,
          questionId,
          userId,
          selectedOptionIds: isMultiSelect 
            ? answers.find(a => a.questionId === questionId)?.selectedOptionIds.includes(optionId)
              ? answers.find(a => a.questionId === questionId)?.selectedOptionIds.filter(id => id !== optionId) || []
              : [...(answers.find(a => a.questionId === questionId)?.selectedOptionIds || []), optionId]
            : [optionId],
          timeSpentIncrementSec: 10, // Increment time spent by 10 seconds
        };
        
        await saveAttemptAnswer(payload).unwrap();
      } catch (error) {
        console.error("Failed to save answer:", error);
      }
    }
  };
  
  // Navigate to next question
  const handleNextQuestion = async () => {
    // Save current answer before moving to next question
    const currentQuestion = allQuestions[currentQuestionIndex];
    const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
    
    if (currentAnswer && testAttemptId && userId) {
      try {
        const payload = {
          attemptId: testAttemptId,
          questionId: currentQuestion.id,
          userId,
          selectedOptionIds: currentAnswer.selectedOptionIds,
          timeSpentIncrementSec: 10, // Increment time spent by 10 seconds
        };
        
        await saveAttemptAnswer(payload).unwrap();
      } catch (error) {
        console.error("Failed to save answer:", error);
      }
    }
    
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Submit test
  const handleSubmitTest = async () => {
    if (testAttemptId) {
      try {
        const payload = {
          attemptId: testAttemptId,
          finalTimeSpentSec: 60 * 60 - timeLeft, // Total time spent
        };
        
        await submitTestAttempt(payload).unwrap();
        setIsTestSubmitted(true); // Set test as submitted
        setSubmissionError(null); // Clear any previous errors
        // Don't navigate immediately, show results first
      } catch (error) {
        console.error("Failed to submit test:", error);
        setSubmissionError("Failed to submit test. Please try again.");
        // Still show results even if submission fails
        setIsTestSubmitted(true);
      }
    } else {
      // Fallback if no attempt ID
      setIsTestSubmitted(true);
      setSubmissionError("Test attempt not found.");
    }
  };

  // Loading state
  if (isBatteryLoading || isTestLoading || isStarting) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <p className="text-gray-600 mt-4">Loading test questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Error state
  if ((isBatteryMode && batteryError) || (!isBatteryMode && testError)) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Failed to Load Test</h3>
            <p className="text-gray-600 mb-6">There was an error loading the test questions. Please try again.</p>
            <Button onClick={() => router.push("/take-test")}>
              Back to Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Get questions based on mode
  let allQuestions: Question[] = [];
  let testName = batteryName;
  
  if (isBatteryMode && batteryData) {
    allQuestions = [...(batteryData.batteryTests?.flatMap(bt => bt.test?.questions || []) || [])];
  } else if (!isBatteryMode && testData) {
    allQuestions = [...(testData.questions || [])];
    testName = testData.title || testName;
  }
  
  // Sort questions by questionNo to ensure they are in the correct order
  allQuestions.sort((a, b) => {
    // Handle cases where questionNo might be missing
    const numA = a.questionNo ?? 0;
    const numB = b.questionNo ?? 0;
    return numA - numB;
  });
  
  // If no questions available, show empty state
  if (allQuestions.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Questions Available</h3>
            <p className="text-gray-600 mb-6">This test doesn't have any questions configured.</p>
            <Button onClick={() => router.push("/take-test")}>
              Back to Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  // Check if current question is answered
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const isAnswered = currentAnswer && currentAnswer.selectedOptionIds.length > 0;
  
  // If test is submitted, show results
  if (isTestSubmitted) {
    const answeredCount = answers.filter(a => a.selectedOptionIds.length > 0).length;
    const unansweredCount = totalQuestions - answeredCount;
    
    // Calculate actual score based on correct answers
    let correctCount = 0;
    let incorrectCount = 0;
    
    // For each question, check if the user's answer is correct
    allQuestions.forEach(question => {
      const userAnswer = answers.find(a => a.questionId === question.id);
      
      if (userAnswer && userAnswer.selectedOptionIds.length > 0) {
        // Get the correct options for this question
        const correctOptions = question.options.filter(option => option.isCorrect);
        const correctOptionIds = correctOptions.map(option => option.id);
        
        // For single choice, user must select exactly the correct option
        // For multiple choice, user must select all correct options and no incorrect ones
        const isCorrect = 
          userAnswer.selectedOptionIds.length === correctOptionIds.length &&
          userAnswer.selectedOptionIds.every(id => correctOptionIds.includes(id)) &&
          correctOptionIds.every(id => userAnswer.selectedOptionIds.includes(id));
        
        if (isCorrect) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      }
    });
    
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Test Results</CardTitle>
            <CardDescription>
              Your test has been submitted successfully
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">Total Questions</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{answeredCount}</div>
                  <div className="text-sm text-muted-foreground">Answered</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{unansweredCount}</div>
                  <div className="text-sm text-muted-foreground">Unanswered</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{correctCount}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-rose-600">{incorrectCount}</div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{percentage}%</div>
                <div className="text-lg text-muted-foreground">Overall Score</div>
              </div>
              
              {submissionError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center text-red-800">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Submission Error</span>
                  </div>
                  <p className="text-red-700 mt-1">{submissionError}</p>
                </div>
              )}
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center text-green-800">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Test Submitted Successfully</span>
                </div>
                <p className="text-green-700 mt-1">
                  Your answers have been recorded. You can view detailed results in your test history.
                </p>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={() => router.push("/user-tests")} 
                  className="w-full"
                >
                  View All Test Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header with timer and progress */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push("/take-test")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {testName}
              </h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{formatTime(timeLeft)}</span>
            </div>
            <Badge variant="default" className="bg-blue-600">
              In Progress
            </Badge>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{Math.round(progress)}% Complete</span>
            <span>{answers.filter(a => a.selectedOptionIds.length > 0).length} of {totalQuestions} answered</span>
          </div>
        </div>
      </div>
      
      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">
                Question {currentQuestion.questionNo}
              </CardTitle>
              <CardDescription>
                {currentQuestion.type === "multiple_choice" ? "Select one answer" : "Select all that apply"}
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {currentQuestion.points} points
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Question text */}
            <div className="text-lg">
              {currentQuestion.text}
            </div>
            
            {/* Question image (if any) */}
            {currentQuestion.imageUrl && (
              <div className="flex justify-center">
                <img 
                  src={currentQuestion.imageUrl} 
                  alt="Question illustration" 
                  className="max-w-full h-auto rounded-lg border"
                />
              </div>
            )}
            
            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.type === "multiple_choice" ? (
                <div className="space-y-3">
                  {currentQuestion.options.map((option: Option) => {
                    const isSelected = currentAnswer?.selectedOptionIds.includes(option.id) || false;
                    return (
                      <div 
                        key={option.id}
                        className={`flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50' : ''}`}
                        onClick={() => handleAnswerSelect(currentQuestion.id, option.id, false)}
                      >
                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                          {isSelected && <div className="h-2 w-2 rounded-full bg-white"></div>}
                        </div>
                        <span>{option.text}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {currentQuestion.options.map((option: Option) => {
                    const isSelected = currentAnswer?.selectedOptionIds.includes(option.id) || false;
                    return (
                      <div 
                        key={option.id}
                        className={`flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50' : ''}`}
                        onClick={() => handleAnswerSelect(currentQuestion.id, option.id, true)}
                      >
                        <div className={`h-5 w-5 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                          {isSelected && <div className="h-2 w-2 rounded bg-white"></div>}
                        </div>
                        <span>{option.text}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0 || isSavingAnswer}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentQuestionIndex === totalQuestions - 1 ? (
          <Button
            onClick={handleSubmitTest}
            disabled={!isAnswered || isSubmitting || isSavingAnswer}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Test
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            disabled={!isAnswered || isSavingAnswer}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}