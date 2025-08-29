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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useGetAllTestsQuery } from "@/services/rtk-query";
import { useStartTestAttemptMutation } from "@/services/rtk-query/test-attempt/test-attempt-api";
import {
  BookOpen,
  Calendar,
  Clock,
  Edit,
  Filter,
  Play,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { TestCreationForm } from "./test-creation-form";
import { TestTakingInterface } from "./test-taking-interface-view";

const mockTests = [
  {
    id: "1",
    title: "Mathematics Final Exam",
    description:
      "MCQ test covering fundamentals of mathematics including algebra, geometry, and calculus",
    isActive: true,
    duration: 60,
    startDate: "2024-12-31T23:59:59.000Z",
    endDate: "2025-01-31T23:59:59.000Z",
    questions: [
      {
        text: "What is the derivative of x²?",
        type: "single",
        points: 5,
        options: [
          { text: "2x", isCorrect: true },
          { text: "x²", isCorrect: false },
          { text: "2", isCorrect: false },
          { text: "x", isCorrect: false },
        ],
      },
      {
        text: "What is the value of π (pi) approximately?",
        type: "single",
        points: 3,
        options: [
          { text: "3.14159", isCorrect: true },
          { text: "2.71828", isCorrect: false },
          { text: "1.41421", isCorrect: false },
          { text: "1.61803", isCorrect: false },
        ],
      },
    ],
    totalQuestions: 2,
    totalPoints: 8,
    assignedCompanies: 3,
    completedAttempts: 45,
  },
  {
    id: "2",
    title: "JavaScript Fundamentals",
    description:
      "Comprehensive test on JavaScript basics, ES6 features, and modern development practices",
    isActive: true,
    duration: 45,
    startDate: "2024-12-01T00:00:00.000Z",
    endDate: "2025-02-28T23:59:59.000Z",
    questions: [
      {
        text: "What is `const` in JavaScript?",
        type: "single",
        points: 5,
        options: [
          { text: "Block-scoped constant", isCorrect: true },
          { text: "Function-scoped variable", isCorrect: false },
          { text: "Global variable", isCorrect: false },
          { text: "Hoisted variable", isCorrect: false },
        ],
      },
    ],
    totalQuestions: 1,
    totalPoints: 5,
    assignedCompanies: 5,
    completedAttempts: 78,
  },
  {
    id: "3",
    title: "Data Structures & Algorithms",
    description:
      "Advanced test covering arrays, linked lists, trees, graphs, and algorithmic complexity",
    isActive: false,
    duration: 90,
    startDate: "2024-11-01T00:00:00.000Z",
    endDate: "2024-11-30T23:59:59.000Z",
    questions: [],
    totalQuestions: 0,
    totalPoints: 0,
    assignedCompanies: 2,
    completedAttempts: 23,
  },
  {
    id: "4",
    title: "React Development",
    description:
      "Test on React components, hooks, state management, and modern React patterns",
    isActive: true,
    duration: 75,
    startDate: "2024-12-15T00:00:00.000Z",
    endDate: "2025-03-15T23:59:59.000Z",
    questions: [],
    totalQuestions: 0,
    totalPoints: 0,
    assignedCompanies: 4,
    completedAttempts: 12,
  },
];

export function TestDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTestInterface, setShowTestInterface] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const { data: allTestsData, isLoading: isLoadingAll } = useGetAllTestsQuery();
  const [testAttemptMut, testAttemptMutState] = useStartTestAttemptMutation();

  const isLoading =
    user?.role === "super_admin"
      ? isLoadingAll
      : user?.role === "company_admin";

  let testsData = [];
  testsData = allTestsData || mockTests;

  const filteredTests = testsData.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && test.isActive) ||
      (statusFilter === "inactive" && !test.isActive);
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getHeaderText = () => {
    return {
      title: "Performance Assessment",
      description: "Manage and monitor all assessment tests",
    };
  };

  const handleStartTest = async () => {
    if (
      !selectedTest
      //  || !user
    ) {
      return;
    }
    try {
      await testAttemptMut({
        testId: selectedTest?.id,
        userId: user?.id || "000",
      });
      sessionStorage.setItem(
        "currentTestAttempt",
        `${testAttemptMutState?.data?.id}`
      );
      setShowTestInterface(true);
    } catch (error) {
      console.error("Failed to start test attempt:", error);
    }
  };

  const headerText = getHeaderText();
  const canCreateTests = user?.role === "super_admin";

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {headerText.title}
          </h1>
          <p className="text-muted-foreground">{headerText.description}</p>
        </div>
        {
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Assessment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Assessment</DialogTitle>
              </DialogHeader>
              <TestCreationForm onClose={() => setShowCreateForm(false)} />
            </DialogContent>
          </Dialog>
        }
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search assessment by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assessments</SelectItem>
                <SelectItem value="active">Active Assessments</SelectItem>
                <SelectItem value="inactive">Inactive Assessments</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Test Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {user?.role === "employee"
                    ? "Assigned Tests"
                    : "Total Evaluation"}
                </p>
                <p className="text-2xl font-bold">
                  {isLoading ? "..." : testsData.length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Evaluations
                </p>
                <p className="text-2xl font-bold">
                  {isLoading
                    ? "..."
                    : testsData.filter((t) => t.isActive).length}
                </p>
              </div>
              <Play className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed Assessments
                </p>
                <p className="text-2xl font-bold">
                  {testsData.reduce((acc, test) => acc + 1, 0)}
                </p>
                {/* <p className="text-2xl font-bold">
                  {testsData.reduce(
                    (acc, test) => acc + test.completedAttempts,
                    0
                  )}
                </p> */}
              </div>
              <Calendar className="h-8 w-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Listing */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <Card
                  key={test.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{test.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={test.isActive ? "default" : "secondary"}
                          >
                            {test.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {test.duration} min
                          </div>
                          {user?.role === "employee" && (
                            <Badge variant="outline">
                              Due: {formatDate("2025-12-31")}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {canCreateTests && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTest(test);
                              setShowEditForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 line-clamp-2">
                      {test.description}
                    </CardDescription>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Questions:
                        </span>
                        <span className="font-medium">
                          {test.questions?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Points:
                        </span>
                        <span className="font-medium">
                          {test.questions?.reduce(
                            (acc, q) => acc + q.points,
                            0
                          ) || 0}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span>Start: {formatDate(test.startDate)}</span>
                        <span>End: {formatDate(test.endDate)}</span>
                      </div>
                      <Button
                        className="w-full"
                        variant={test.isActive ? "default" : "secondary"}
                        onClick={() => {
                          setSelectedTest(test);
                          handleStartTest();
                        }}
                        disabled={
                          !test.isActive ||
                          (test.questions?.length || 0) === 0 ||
                          (user?.role === "employee" &&
                            new Date("2025-12-31") < new Date())
                        }
                      >
                        {(test.questions?.length || 0) === 0
                          ? "No Questions"
                          : "Take Assessment"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium">Assessment Name</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Duration</th>
                      <th className="p-4 font-medium">Questions</th>
                      <th className="p-4 font-medium">Companies</th>
                      <th className="p-4 font-medium">Attempts</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.map((test) => (
                      <tr key={test.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{test.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {test.description}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={test.isActive ? "default" : "secondary"}
                          >
                            {test.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            {test.duration} min
                          </div>
                        </td>
                        <td className="p-4">{test.questions?.length || 0}</td>
                        <td className="p-4">10</td>
                        <td className="p-4">10</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTest(test);
                                handleStartTest();
                              }}
                              disabled={
                                !test.isActive ||
                                (test.questions?.length || 0) === 0 ||
                                (user?.role === "employee" &&
                                  new Date("2025-12-31") < new Date())
                              }
                            >
                              {(test.questions?.length || 0) === 0
                                ? "No Questions"
                                : user?.role === "employee" &&
                                  new Date("2025-12-31") < new Date()
                                ? "Expired"
                                : "Take Assessment"}
                            </Button>
                            {canCreateTests && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTest(test);
                                  setShowEditForm(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Test Dialog */}
      {canCreateTests && (
        <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
          <DialogContent className="max-w-4xl sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Test: {selectedTest?.title}</DialogTitle>
            </DialogHeader>
            {selectedTest && (
              <TestCreationForm
                testData={selectedTest}
                isEditing={true}
                onClose={() => setShowEditForm(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Test Taking Interface Dialog */}
      <Dialog open={showTestInterface} onOpenChange={setShowTestInterface}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()} // prevents closing on outside click
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="max-w-4xl sm:max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Taking Test: {selectedTest?.title}</DialogTitle>
          </DialogHeader>
          {selectedTest && (
            <TestTakingInterface
              test={selectedTest}
              onClose={() => setShowTestInterface(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
