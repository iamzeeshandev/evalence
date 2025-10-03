"use client";

import { Button } from "@/components/ui/button";
import { Check, Edit, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

interface Question {
  text: string;
  type: "single";
  points: number;
  questionNo: number;
  imageUrl?: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

interface QuestionsListViewProps {
  questions: Question[];
  onEditQuestion: (questionNumber: number) => void;
  onDeleteQuestion: (questionNumber: number) => void;
}

export function QuestionsListView({
  questions,
  onEditQuestion,
  onDeleteQuestion,
}: QuestionsListViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever questions update
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [questions]); // This will run every time the questions array changes

  if (questions.length === 0) {
    return null;
  }

  return (
    <div
      ref={scrollContainerRef}
      className="space-y-4 max-h-[65vh] overflow-y-auto scroll-smooth"
    >
      {questions.reverse().map((question, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
        >
          {/* Header with question number and actions */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                {question.questionNo}
              </div>
              <h4 className="font-semibold text-gray-900">
                Question {question.questionNo}
              </h4>
            </div>
            <div className="flex items-center gap-1">
              <div className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                {question.points} {question.points === 1 ? "pt" : "pts"}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditQuestion(question.questionNo)}
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                title="Edit question"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteQuestion(question.questionNo)}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Delete question"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Question text */}
          <p className="text-gray-700 mb-4 leading-relaxed">{question.text}</p>

          {/* Question image */}
          {question.imageUrl && (
            <div className="mb-4">
              <img
                src={question.imageUrl || "/placeholder.svg"}
                alt="Question visual"
                className="max-w-full max-h-48 rounded-lg border border-gray-200 object-contain"
              />
            </div>
          )}

          {/* Options list */}
          <div className="space-y-2.5">
            {[...question.options]
              ?.sort((a, b) => a.text.localeCompare(b.text))
              .map((option, optIndex) => (
                <div
                  key={optIndex}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    option.isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                      option.isCorrect
                        ? "bg-green-500 border-green-600"
                        : "bg-white border-gray-400"
                    }`}
                  >
                    {option.isCorrect && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm flex-1 leading-tight ${
                      option.isCorrect
                        ? "font-medium text-green-800"
                        : "text-gray-700"
                    }`}
                  >
                    {option.text}
                  </span>
                </div>
              ))}
          </div>

          {/* Footer with correct answer indicator */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {question.options.filter((opt) => opt.isCorrect).length === 1
                  ? "1 correct answer"
                  : `0 correct answer`}
              </span>
              <span>{question.options.length} options</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
