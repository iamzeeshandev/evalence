"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, Upload, X, ImageIcon, Edit } from "lucide-react";
import { useFileUploadMutation } from "@/services/rtk-query/file/file-api";
import {
  useSaveTestMutation,
  useUpdateTestMutation,
} from "@/services/rtk-query";

interface Question {
  text: string;
  type: "single";
  points: number;
  imageUrl?: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

interface TestCreationFormProps {
  onClose: () => void;
  testData?: any;
  isEditing?: boolean;
}

const useUploadFile = () => {
  const uploadFile = async (file: File) => {
    return new Promise<{
      message: string;
      filename: string;
      originalName: string;
      size: number;
      imageUrl: string;
    }>((resolve) => {
      setTimeout(() => {
        resolve({
          message: "File uploaded successfully",
          filename: `image-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}.png`,
          originalName: file.name,
          size: file.size,
          imageUrl: `http://localhost:3000/uploads/image-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}.png`,
        });
      }, 1000);
    });
  };

  return { uploadFile };
};

export function TestCreationForm({
  onClose,
  testData: initialTestData,
  isEditing = false,
}: TestCreationFormProps) {
  const [testData, setTestData] = useState({
    title: initialTestData?.title || "",
    description: initialTestData?.description || "",
    isActive: initialTestData?.isActive ?? true,
    duration: initialTestData?.duration || 60,
    startDate: initialTestData?.startDate
      ? new Date(initialTestData.startDate).toISOString().slice(0, 16)
      : "",
    endDate: initialTestData?.endDate
      ? new Date(initialTestData.endDate).toISOString().slice(0, 16)
      : "",
  });

  const [questions, setQuestions] = useState<Question[]>(
    initialTestData?.questions || []
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    text: "",
    type: "single",
    points: 5,
    imageUrl: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });

  const [isUploading, setIsUploading] = useState(false);
  const { uploadFile } = useUploadFile();
  const [uploadFileMutation] = useFileUploadMutation();
  const [saveTestMutation, saveTestMutationState] = useSaveTestMutation();
  const [updateTestMutation] = useUpdateTestMutation();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      //   const response = await uploadFile(file);
      const response = await uploadFileMutation({ image: file });
      setCurrentQuestion({
        ...currentQuestion,
        imageUrl: response.data?.imageUrl || "",
      });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setCurrentQuestion({ ...currentQuestion, imageUrl: "" });
  };

  const addQuestion = () => {
    if (
      currentQuestion.text &&
      currentQuestion.options.some((opt) => opt.text)
    ) {
      setQuestions([...questions, { ...currentQuestion }]);
      setCurrentQuestion({
        text: "",
        type: "single",
        points: 5,
        imageUrl: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      });
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const editQuestion = (index: number) => {
    const questionToEdit = questions[index];
    setCurrentQuestion({ ...questionToEdit });
    removeQuestion(index);
  };

  const updateOption = (
    optionIndex: number,
    field: "text" | "isCorrect",
    value: string | boolean
  ) => {
    const updatedOptions = currentQuestion.options.map((option, i) => {
      if (i === optionIndex) {
        if (field === "isCorrect" && value === true) {
          return { ...option, [field]: value };
        } else if (field === "isCorrect" && value === false) {
          return { ...option, [field]: value };
        } else {
          return { ...option, [field]: value };
        }
      } else if (field === "isCorrect" && value === true) {
        return { ...option, isCorrect: false };
      }
      return option;
    });

    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const handleSaveTest = async () => {
    const payload = {
      ...testData,
      startDate: testData.startDate
        ? new Date(testData.startDate).toISOString()
        : "",
      endDate: testData.endDate ? new Date(testData.endDate).toISOString() : "",
      questions: questions,
    };
    await saveTestMutation(payload);
    console.log(
      `${isEditing ? "Updated" : "Created"} test payload:`,
      JSON.stringify(payload, null, 2)
    );
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Test Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Test Information" : "Test Information"}
          </CardTitle>
          <CardDescription>Basic details about the test</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Test Title</Label>
              <Input
                id="title"
                value={testData.title}
                onChange={(e) =>
                  setTestData({ ...testData, title: e.target.value })
                }
                placeholder="Enter test title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={testData.duration}
                onChange={(e) =>
                  setTestData({
                    ...testData,
                    duration: Number.parseInt(e.target.value),
                  })
                }
                placeholder="60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={testData.description}
              onChange={(e) =>
                setTestData({ ...testData, description: e.target.value })
              }
              placeholder="Enter test description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={testData.startDate}
                onChange={(e) =>
                  setTestData({ ...testData, startDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={testData.endDate}
                onChange={(e) =>
                  setTestData({ ...testData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={testData.isActive}
              onCheckedChange={(checked) =>
                setTestData({ ...testData, isActive: checked })
              }
            />
            <Label htmlFor="isActive">Active Test</Label>
          </div>
        </CardContent>
      </Card>

      {/* Question Creation */}
      <Card>
        <CardHeader>
          <CardTitle>Add Question</CardTitle>
          <CardDescription>Create multiple choice questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="questionText">Question Text</Label>
            <Textarea
              id="questionText"
              value={currentQuestion.text}
              onChange={(e) =>
                setCurrentQuestion({ ...currentQuestion, text: e.target.value })
              }
              placeholder="Enter your question here"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Question Image (Optional)</Label>
            {currentQuestion.imageUrl ? (
              <div className="relative inline-block">
                <img
                  src={currentQuestion.imageUrl || "/placeholder.svg"}
                  alt="Question"
                  className="max-w-xs max-h-48 rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <div className="mt-4">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <Upload className="h-4 w-4" />
                        {isUploading ? "Uploading..." : "Click to upload image"}
                      </div>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              type="number"
              value={currentQuestion.points}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  points: Number.parseInt(e.target.value),
                })
              }
              className="w-24"
            />
          </div>

          <div className="space-y-3">
            <Label>Answer Options</Label>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(index, "text", e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={option.isCorrect}
                    onChange={(e) =>
                      updateOption(index, "isCorrect", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <Label className="text-sm">Correct</Label>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={addQuestion} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </CardContent>
      </Card>

      {/* Questions List */}
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions ({questions.length})</CardTitle>
            <CardDescription>Review and manage added questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{question.points} pts</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editQuestion(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{question.text}</p>
                  {question.imageUrl && (
                    <img
                      src={question.imageUrl || "/placeholder.svg"}
                      alt="Question"
                      className="max-w-xs max-h-32 rounded border mb-3"
                    />
                  )}
                  <div className="space-y-1">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            option.isCorrect ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                        <span
                          className={
                            option.isCorrect
                              ? "font-medium text-green-700"
                              : "text-muted-foreground"
                          }
                        >
                          {option.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSaveTest}
          disabled={
            !testData.title ||
            questions.length === 0 ||
            saveTestMutationState.isLoading
          }
        >
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? "Update Test" : "Save Test"}
        </Button>
      </div>
    </div>
  );
}
