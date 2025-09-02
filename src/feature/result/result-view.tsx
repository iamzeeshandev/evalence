"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLazyGetUserTestAttemptListByIdQuery } from "@/services/rtk-query/test-attempt/test-attempt-api";
import { TestAttemptResponse } from "@/services/rtk-query/test-attempt/test-attempt-type";
import {
  Calendar,
  CheckCircle,
  Clock,
  Target,
  Trophy,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const mockUsers: any[] = [
  {
    id: "e507bb37-9155-4833-a234-1d2d3ddfb36d",
    name: "John Doe",
    email: "john@example.com",
  },
  {
    id: "f608cc48-a266-5944-b345-2e3e4eefg47e",
    name: "Jane Smith",
    email: "jane@example.com",
  },
  {
    id: "g719dd59-b377-6055-c456-3f4f5ffgh58f",
    name: "Mike Johnson",
    email: "mike@example.com",
  },
];

const mockTestAttempts: TestAttemptResponse[] = [
  {
    id: "1a438040-5a82-42b4-abe9-805b6ab512b6",
    testId: "5c612485-7829-47bd-8b1d-394bca0af2b8",
    userId: "e507bb37-9155-4833-a234-1d2d3ddfb36d",
    status: "submitted",
    totalPoints: 5,
    awardedPoints: 5,
    percentage: 100.00,
    correctCount: 1,
    questionCount: 2,
    timeSpentSec: 15000,
    isTimedOut: false,
    startedAt: "2025-08-29T11:12:00.000Z",
    submittedAt: "2025-08-29T11:14:47.000Z",
    createdAt: "2025-08-29T11:12:00.021Z",
    updatedAt: "2025-08-29T11:14:46.000Z",
    test: {
      id: "5c612485-7829-47bd-8b1d-394bca0af2b8",
      title: "Demo Test New",
      description: "Demo Test New",
      duration: 60,
      startDate: "2025-08-25T11:09:00.000Z",
      endDate: "2025-09-06T11:10:00.000Z",
      isActive: true,
      createdAt: "2025-08-29T11:10:40.671Z",
      updatedAt: "2025-08-29T11:14:11.362Z",
      questions: [
        {
          id: "ab6a7222-727d-4c0b-ad6c-ef87cfa3700b",
          text: "Demo Test New Question",
          type: "single",
          points: 5,
          imageUrl:
            "http://localhost:3000/uploads/image-1756465815986-472599812.png",
          createdAt: "2025-08-29T11:10:40.735Z",
          updatedAt: "2025-08-29T11:10:40.735Z",
          options: [
            {
              id: "15cb792b-0a01-4325-91a6-f03f41a386ac",
              text: "B",
              isCorrect: false,
              imageUrl: null,
              createdAt: "2025-08-29T11:10:40.759Z",
              updatedAt: "2025-08-29T11:10:40.759Z",
            },
            {
              id: "3ed312e1-9528-4ced-b40d-c8efd42fa11c",
              text: "C",
              isCorrect: true,
              imageUrl: null,
              createdAt: "2025-08-29T11:10:40.766Z",
              updatedAt: "2025-08-29T11:10:40.766Z",
            },
            {
              id: "4c8b205d-653f-49ac-bdd8-d2abb79c5725",
              text: "D",
              isCorrect: false,
              imageUrl: null,
              createdAt: "2025-08-29T11:10:40.772Z",
              updatedAt: "2025-08-29T11:10:40.772Z",
            },
            {
              id: "8ff029f0-332e-49e0-810a-b8c1eb5527a8",
              text: "A",
              isCorrect: false,
              imageUrl: null,
              createdAt: "2025-08-29T11:10:40.748Z",
              updatedAt: "2025-08-29T11:10:40.748Z",
            },
          ],
        },
      ],
    },
    attemptAnswers: [
      {
        id: "834294a0-a876-4347-9592-041e91b0c68a",
        attemptId: "1a438040-5a82-42b4-abe9-805b6ab512b6",
        questionId: "ab6a7222-727d-4c0b-ad6c-ef87cfa3700b",
        selectedOptionIds: ["3ed312e1-9528-4ced-b40d-c8efd42fa11c"],
        isCorrect: true,
        pointsAwarded: 5,
        createdAt: "2025-08-29T11:14:16.871Z",
        updatedAt: "2025-08-29T13:43:22.295Z",
      },
    ],
  },
  {
    id: "2b549151-6b93-53c5-bcfa-916c7bc623c7",
    testId: "6d723596-8940-58ce-92e2-405dbc1bg3c9",
    userId: "e507bb37-9155-4833-a234-1d2d3ddfb36d",
    status: "submitted",
    totalPoints: 10,
    awardedPoints: 7,
    percentage: 70.00,
    correctCount: 2,
    questionCount: 3,
    timeSpentSec: 25000,
    isTimedOut: false,
    startedAt: "2025-08-28T10:30:00.000Z",
    submittedAt: "2025-08-28T10:37:30.000Z",
    createdAt: "2025-08-28T10:30:00.021Z",
    updatedAt: "2025-08-28T10:37:30.000Z",
    test: {
      id: "6d723596-8940-58ce-92e2-405dbc1bg3c9",
      title: "Mathematics Quiz",
      description: "Basic mathematics assessment",
      duration: 45,
      startDate: "2025-08-20T09:00:00.000Z",
      endDate: "2025-09-10T18:00:00.000Z",
      isActive: true,
      createdAt: "2025-08-20T09:00:00.000Z",
      updatedAt: "2025-08-20T09:00:00.000Z",
      questions: [
        {
          id: "bc7b8333-838e-5d1c-be7d-fg98dgb4811c",
          text: "What is 2 + 2?",
          type: "single",
          points: 3,
          createdAt: "2025-08-20T09:00:00.000Z",
          updatedAt: "2025-08-20T09:00:00.000Z",
          options: [
            {
              id: "26dc893c-1b12-5436-a2b7-g14g52gb497bd",
              text: "3",
              isCorrect: false,
              createdAt: "2025-08-20T09:00:00.000Z",
              updatedAt: "2025-08-20T09:00:00.000Z",
            },
            {
              id: "4fe423f2-a639-6def-c51e-d9efd53hc22fd",
              text: "4",
              isCorrect: true,
              createdAt: "2025-08-20T09:00:00.000Z",
              updatedAt: "2025-08-20T09:00:00.000Z",
            },
          ],
        },
      ],
    },
    attemptAnswers: [
      {
        id: "945395b1-b987-4458-a693-152f92f1d79b",
        attemptId: "2b549151-6b93-53c5-bcfa-916c7bc623c7",
        questionId: "bc7b8333-838e-5d1c-be7d-fg98dgb4811c",
        selectedOptionIds: ["4fe423f2-a639-6def-c51e-d9efd53hc22fd"],
        isCorrect: true,
        pointsAwarded: 3,
        createdAt: "2025-08-28T10:35:00.000Z",
        updatedAt: "2025-08-28T10:35:00.000Z",
      },
    ],
  },
];

interface TestResultsPageProps {
  // Props for API integration
  users?: any[];

  loading?: boolean;
}

export function TestResultsPage({
  users = mockUsers,
  loading = false,
}: TestResultsPageProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [testAttempts, setTestAttempts] = useState<TestAttemptResponse[]>();
  const [selectedAttempt, setSelectedAttempt] =
    useState<TestAttemptResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [
    fetchUserTestAttemptsList,
    {
      data: userTestAttempts,
      isLoading: isUserTestAttemptsLoading,
      isFetching: isUserTestAttemptsFetching,
    },
  ] = useLazyGetUserTestAttemptListByIdQuery();

  const handleUserSelect = (userId: any) => {
    setSelectedUserId(userId);
    fetchUserTestAttemptsList(userId);
  };

  useEffect(() => {
    if (userTestAttempts) setTestAttempts(userTestAttempts);
  }, [userTestAttempts]);

  const selectedUser = users.find((user) => user.id === selectedUserId);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: { variant: "default" as const, label: "Completed" },
      in_progress: { variant: "secondary" as const, label: "In Progress" },
      expired: { variant: "destructive" as const, label: "Expired" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.submitted;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const openAttemptDetails = (attempt: TestAttemptResponse) => {
    setSelectedAttempt(attempt);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Assessment Results
          </h1>
          <p className="text-muted-foreground">
            View and analyze assessment results
          </p>
        </div>
      </div>

      {/* User Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Select User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedUserId} onValueChange={handleUserSelect}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="View user assessment results" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{`${user?.firstName} ${user?.lastName}`}</span>
                    {/* <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span> */}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Test Attempts Listing */}
      {selectedUserId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Assessments for {selectedUser?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-muted rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : testAttempts?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No test attempts found for this user.
              </div>
            ) : (
              <div className="space-y-4">
                {(testAttempts || [])?.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => openAttemptDetails(attempt)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {attempt.test.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {attempt.test.description}
                        </p>
                      </div>
                      {getStatusBadge(attempt.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span>
                          Score: {attempt.awardedPoints}/{attempt.totalPoints}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span>{Math.round(attempt.percentage)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span>{formatDuration(attempt.timeSpentSec)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span>
                          {formatDate(attempt?.submittedAt as string)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detailed Results Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedAttempt?.test.title} - Detailed Results
            </DialogTitle>
          </DialogHeader>

          {selectedAttempt && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedAttempt.awardedPoints}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Points Earned
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(selectedAttempt.percentage)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Percentage
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedAttempt.correctCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Correct Answers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatDuration(selectedAttempt.timeSpentSec)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Time Spent
                  </div>
                </div>
              </div>

              {/* Questions and Answers */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Questions & Answers</h3>
                {selectedAttempt.test.questions.map((question, index) => {
                  const userAnswer = selectedAttempt.attemptAnswers.find(
                    (answer) => answer.questionId === question.id
                  );
                  const selectedOptions = question.options.filter((option) =>
                    userAnswer?.selectedOptionIds.includes(option.id)
                  );
                  const correctOptions = question.options.filter(
                    (option) => option.isCorrect
                  );

                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">
                            Question {index + 1}: {question.text}
                          </h4>
                          {question.imageUrl && (
                            <img
                              src={question.imageUrl || "/placeholder.svg"}
                              alt="Question image"
                              className="max-w-md h-auto rounded-lg mb-3"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {userAnswer?.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="text-sm font-medium">
                            {userAnswer?.pointsAwarded || 0}/{question.points}{" "}
                            pts
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {[...question.options]
                          ?.sort((a, b) => a.text.localeCompare(b.text))
                          .map((option) => {
                            const isSelected = selectedOptions.some(
                              (selected) => selected.id === option.id
                            );
                            const isCorrect = option.isCorrect;

                            let optionClass = "p-2 rounded border ";
                            if (isSelected && isCorrect) {
                              optionClass +=
                                "bg-green-50 border-green-200 text-green-800";
                            } else if (isSelected && !isCorrect) {
                              optionClass +=
                                "bg-red-50 border-red-200 text-red-800";
                            } else if (!isSelected && isCorrect) {
                              optionClass +=
                                "bg-blue-50 border-blue-200 text-blue-800";
                            } else {
                              optionClass += "bg-gray-50 border-gray-200";
                            }

                            return (
                              <div key={option.id} className={optionClass}>
                                <div className="flex items-center justify-between">
                                  <span>{option.text}</span>
                                  <div className="flex items-center gap-2">
                                    {isSelected && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Selected
                                      </Badge>
                                    )}
                                    {isCorrect && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-green-100"
                                      >
                                        Correct
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
