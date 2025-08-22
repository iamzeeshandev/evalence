"use client";

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
import { Plus, Trash2, Save } from "lucide-react";

interface Question {
  text: string;
  type: "single";
  points: number;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

interface TestCreationFormProps {
  onClose: () => void;
}

export function TestCreationForm({ onClose }: TestCreationFormProps) {
  const [testData, setTestData] = useState({
    title: "",
    description: "",
    isActive: true,
    duration: 60,
    startDate: "",
    endDate: "",
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    text: "",
    type: "single",
    points: 5,
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });

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

  const updateOption = (
    optionIndex: number,
    field: "text" | "isCorrect",
    value: string | boolean
  ) => {
    const updatedOptions = currentQuestion.options.map((option, i) => {
      if (i === optionIndex) {
        if (field === "isCorrect" && value === true) {
          // Only one correct answer allowed
          return { ...option, [field]: value };
        } else if (field === "isCorrect" && value === false) {
          return { ...option, [field]: value };
        } else {
          return { ...option, [field]: value };
        }
      } else if (field === "isCorrect" && value === true) {
        // Uncheck other options when one is marked correct
        return { ...option, isCorrect: false };
      }
      return option;
    });

    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const handleSaveTest = () => {
    const payload = {
      ...testData,
      questions: questions,
    };
    console.log("Test payload:", JSON.stringify(payload, null, 2));
    // Here you would typically send the payload to your API
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Test Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Test Information</CardTitle>
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
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{question.text}</p>
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
          disabled={!testData.title || questions.length === 0}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Test
        </Button>
      </div>
    </div>
  );
}
