"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  useSaveTestMutation,
  useUpdateTestMutation,
} from "@/services/rtk-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  FileText,
  List,
  Loader2,
  PlusCircle,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TestBasicInfoForm } from "./assessment-basic-info-form";
import { QuestionCreationForm } from "./assessment-question-creation-form";
import { QuestionsListView } from "./assessment-questions-list-view";

const testSchema = z.object({
  title: z
    .string()
    .min(1, "Assessment title is required")
    .min(3, "Title must be at least 3 characters"),
  type: z.string().min(1, "Assessment type is required"),
  description: z
    .string()
    .min(0, { message: "Description is required" })
    .min(1, { message: "Description must be at least 20 characters" }),
  isActive: z.boolean(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  questions: z
    .array(
      z.object({
        text: z.string().min(1, "Question text is required"),
        type: z.literal("single"),
        points: z.number().min(1, "Points must be at least 1"),
        questionNo: z.number(),
        imageUrl: z.string().optional(),
        options: z
          .array(
            z.object({
              text: z.string().min(1, "Option text is required"),
              isCorrect: z.boolean(),
              score: z.number().optional(),
            })
          )
          .min(2, "At least 2 options are required"),
        // Psychometric-specific fields
        scoringStandard: z.string().optional(),
        orientation: z.enum(["straight", "reverse"]).optional(),
        dimension: z.string().optional(),
      })
    )
    .min(1, "At least one question is required"),

  currentQuestion: z.object({
    text: z.string(),
    type: z.literal("single"),
    points: z.number(),
    imageUrl: z.string().optional(),
    options: z.array(
      z.object({
        text: z.string(),
        isCorrect: z.boolean(),
        score: z.number().optional(),
      })
    ),
    // Psychometric-specific fields
    scoringStandard: z.string().optional(),
    orientation: z.enum(["straight", "reverse"]).optional(),
    dimension: z.string().optional(),
  }),
});

type TestFormData = z.infer<typeof testSchema>;

interface TestCreationFormProps {
  testData?: any;
  isEditing?: boolean;
  testId?: string;
}

export function TestCreationForm({
  testData: initialTestData,
  isEditing = false,
  testId,
}: TestCreationFormProps) {
  const router = useRouter();
  const [editingQuestionNumber, setEditingQuestionNumber] = useState<
    number | null
  >(null);

  const [saveTestMutation, { isLoading: isSaving }] = useSaveTestMutation();
  const [updateTestMutation, { isLoading: isUpdating }] =
    useUpdateTestMutation();

  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      title: "",
      description: "",
      isActive: true,
      duration: 60,
      questions: [],
      currentQuestion: {
        text: "",
        type: "single",
        points: 5,
        imageUrl: "",
        options: [
          { text: "", isCorrect: false, score: 0 },
          { text: "", isCorrect: false, score: 0 },
          { text: "", isCorrect: false, score: 0 },
          { text: "", isCorrect: false, score: 0 },
        ],
        scoringStandard: "",
        orientation: undefined,
        dimension: "",
      },
    },
  });

  useEffect(() => {
    if (isEditing && initialTestData) {
      form.reset({
        title: initialTestData.title,
        description: initialTestData.description || "",
        isActive: initialTestData.isActive,
        duration: initialTestData.duration,
        questions: initialTestData.questions || [],
        currentQuestion: {
          text: "",
          type: "single",
          points: 5,
          imageUrl: "",
          options: [
            { text: "", isCorrect: false, score: 0 },
            { text: "", isCorrect: false, score: 0 },
            { text: "", isCorrect: false, score: 0 },
            { text: "", isCorrect: false, score: 0 },
          ],
          scoringStandard: "",
          orientation: undefined,
          dimension: "",
        },
      });
    }
  }, [isEditing, initialTestData, form]);

  const questions = form.watch("questions");

  const handleAddQuestion = () => {
    const questions = form.getValues("questions");
    const currentQuestionData = form.getValues("currentQuestion");

    // Validate current question
    if (!currentQuestionData.text.trim()) {
      form.setError("currentQuestion.text", {
        message: "Question text is required",
      });
      return;
    }

    const options = currentQuestionData.options;

    // Check each option
    let hasEmpty = false;
    options.forEach((opt, index) => {
      if (!opt.text.trim()) {
        hasEmpty = true;
        form.setError(`currentQuestion.options.${index}.text`, {
          type: "manual",
          message: "Option text is required",
        });
      }
    });

    if (hasEmpty) return;

    if (editingQuestionNumber !== null) {
      // Update existing question by finding it by questionNo and replacing it
      const updatedQuestions = questions.map((q) => 
        q.questionNo === editingQuestionNumber 
          ? { ...currentQuestionData, questionNo: editingQuestionNumber } 
          : q
      );
      form.setValue("questions", updatedQuestions);
      setEditingQuestionNumber(null);
    } else {
      // Add new question
      const newQuestion = {
        ...currentQuestionData,
        questionNo: questions.length + 1,
      };
      form.setValue("questions", [...questions, newQuestion]);
    }

    // Reset current question
    form.setValue("currentQuestion", {
      text: "",
      type: "single",
      points: 5,
      imageUrl: "",
      options: [
        { text: "", isCorrect: false, score: 0 },
        { text: "", isCorrect: false, score: 0 },
        { text: "", isCorrect: false, score: 0 },
        { text: "", isCorrect: false, score: 0 },
      ],
      scoringStandard: "",
      orientation: undefined,
      dimension: "",
    });
  };

  const handleEditQuestion = (questionNumber: number) => {
    const questionToEdit = questions.find(
      (q) => q.questionNo === questionNumber
    );
    if (questionToEdit) {
      form.setValue("currentQuestion", questionToEdit);
      setEditingQuestionNumber(questionNumber);
    }
  };

  const handleDeleteQuestion = (questionNumber: number) => {
    // Filter out the question to delete
    const updatedQuestions = questions.filter((q) => q.questionNo !== questionNumber);
    
    form.setValue("questions", updatedQuestions);
    
    // If we're editing the deleted question, cancel edit mode
    if (editingQuestionNumber === questionNumber) {
      setEditingQuestionNumber(null);
      form.setValue("currentQuestion", {
        text: "",
        type: "single",
        points: 5,
        imageUrl: "",
        options: [
          { text: "", isCorrect: false, score: 0 },
          { text: "", isCorrect: false, score: 0 },
          { text: "", isCorrect: false, score: 0 },
          { text: "", isCorrect: false, score: 0 },
        ],
        scoringStandard: "",
        orientation: undefined,
        dimension: "",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestionNumber(null);
    form.setValue("currentQuestion", {
      text: "",
      type: "single",
      points: 5,
      imageUrl: "",
      options: [
        { text: "", isCorrect: false, score: 0 },
        { text: "", isCorrect: false, score: 0 },
        { text: "", isCorrect: false, score: 0 },
        { text: "", isCorrect: false, score: 0 },
      ],
      scoringStandard: "",
      orientation: undefined,
      dimension: "",
    });
  };

  const onSubmit = async (data: TestFormData) => {
    try {
      const payload = {
        title: data.title,
        type: data.type,
        description: data.description,
        isActive: data.isActive,
        duration: data.duration,
        questions: data.questions,
      };

      if (isEditing && testId) {
        const res = await updateTestMutation({ id: testId, payload }).unwrap();
        if (res) router.push(`/test`);
      } else {
        const res = await saveTestMutation(payload).unwrap();
        if (res) router.push(`/test`);
      }

      // onClose();
    } catch (err: any) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} test:`,
        err?.data?.message || "An error occurred"
      );
    }
  };

  const isLoading = isSaving || isUpdating;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0 max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/test">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">
                {isEditing ? "Update Test" : "Create New Test"}
              </h1>
            </div>

            <p className="text-muted-foreground">
              {isEditing
                ? "Update your assessment details and questions"
                : "Create a new assessment by filling in the details below"}
            </p>
          </div>
        </div>

        {/* Left Column: Assessment + Question Creation in single card */}
        <div className="lg:col-span-2 mb-6">
          <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-200">
            <CardContent className="px-6 space-y-8">
              {/* Test Basic Information */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      {isEditing
                        ? "Edit Assessment Information"
                        : "Assessment Information"}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Basic details about the assessment
                    </CardDescription>
                  </div>
                </div>
                <TestBasicInfoForm />
              </div>

              {/* Question Creation */}
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <PlusCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      {editingQuestionNumber !== null
                        ? `Edit Question ${editingQuestionNumber}`
                        : `Add Question ${questions.length + 1}`}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Create multiple choice questions
                    </CardDescription>
                  </div>
                </div>
                <QuestionCreationForm
                  onAddQuestion={handleAddQuestion}
                  isEditing={editingQuestionNumber !== null}
                  onCancelEdit={handleCancelEdit}
                />
              </div>

              {/* Action Buttons*/}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || questions.length === 0}
                  className="flex-1  disabled:bg-gray-300 disabled:text-gray-500"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? "Update Assessment" : "Save Assessment"}
                    </div>
                  )}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => router.push("/test")}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Questions List - Always Visible */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card className="shadow-sm border-gray-200 h-full flex flex-col">
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <List className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      Questions ({questions.length})
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {questions.length === 0
                        ? "No questions added yet"
                        : "Review and manage added questions"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                {questions.length > 0 ? (
                  <div>
                    <QuestionsListView
                      questions={questions}
                      onEditQuestion={handleEditQuestion}
                      onDeleteQuestion={handleDeleteQuestion}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center p-6">
                    <div className="p-3 bg-gray-100 rounded-full mb-3">
                      <List className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium mb-1">
                      No questions yet
                    </p>
                    <p className="text-gray-400 text-sm">
                      Questions you add will appear here for easy management
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
