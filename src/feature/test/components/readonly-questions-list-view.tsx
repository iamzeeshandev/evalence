"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Question {
  id: string;
  text: string;
  type: string;
  points?: number;
  questionNo: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    score?: number;
    imageUrl?: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  // Psychometric-specific fields
  orientation?: "straight" | "reverse";
  dimension?: string;
}

interface ReadonlyQuestionsListViewProps {
  questions: Question[];
}

export function ReadonlyQuestionsListView({
  questions,
}: ReadonlyQuestionsListViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [maxHeight, setMaxHeight] = useState("65vh");

  // Calculate available height based on viewport
  useEffect(() => {
    const updateMaxHeight = () => {
      const vh = window.innerHeight * 0.01;
      // Use 65% of viewport height as default, but you can adjust this
      const calculatedHeight = `calc(${65 * vh}px)`;
      setMaxHeight(calculatedHeight);
    };

    // Set initial height
    updateMaxHeight();

    // Update on window resize
    window.addEventListener("resize", updateMaxHeight);

    return () => {
      window.removeEventListener("resize", updateMaxHeight);
    };
  }, []);
  
  // Scroll to bottom whenever questions array length changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [questions.length]); // Now only depends on array length

  if (questions.length === 0) {
    return null;
  }

  return (
    <div
      ref={scrollContainerRef}
      className="space-y-1.5  overflow-y-auto scroll-smooth"
      style={{ maxHeight }}
    >
      {[...questions].sort((a, b) => a.questionNo - b.questionNo).map((question) => (
        <div
          key={question.questionNo}
          className="border-b border-gray-150 py-3 bg-white hover:bg-gray-50 transition-colors duration-150 last:border-b-0"
        >
          {/* Header with question number */}
          <div className="flex justify-between items-start mb-2 px-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-700 rounded font-medium text-xs">
                {question.questionNo}
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">
                Q{question.questionNo}
              </h4>
            </div>
            <div className="flex items-center gap-1">
              {question.points && (
                <div className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                  {question.points} {question.points === 1 ? "pt" : "pts"}
                </div>
              )}
              {question.orientation && (
                <div className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {question.orientation}
                </div>
              )}
            </div>
          </div>

          {/* Question text */}
          <p className="text-gray-700 mb-2 leading-relaxed text-sm px-3 line-clamp-2">
            {question.text}
          </p>

          {/* Question image */}
          {question.imageUrl && (
            <div className="mb-2 px-3">
              <div className="flex items-center justify-center min-w-[120px] min-h-[80px] bg-gray-100 rounded border border-gray-200 overflow-hidden">
                <img
                  src={question.imageUrl || "/placeholder.svg"}
                  alt="Question visual"
                  className="max-w-full max-h-24 object-contain"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="space-y-1 px-3">
            {question.options.map((option, optIndex) => (
              <div
                key={optIndex}
                className={`flex items-start gap-1.5 p-1.5 rounded border transition-colors ${
                  option.isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-3.5 h-3.5 rounded-full border mt-0.5 ${
                    option.isCorrect
                      ? "bg-green-500 border-green-600"
                      : "bg-white border-gray-400"
                  }`}
                >
                  {option.isCorrect && (
                    <Check className="h-2 w-2 text-white" />
                  )}
                </div>
                <span
                  className={`text-xs flex-1 leading-tight ${
                    option.isCorrect
                      ? "font-medium text-green-800"
                      : "text-gray-700"
                  }`}
                >
                  {option.text}
                </span>
                {option.score !== undefined && (
                  <span className="text-xs text-gray-500 font-medium">
                    ({option.score})
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Footer with correct answer indicator */}
          <div className="mt-2 pt-1.5 border-t border-gray-100 px-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {question.options.filter((opt) => opt.isCorrect).length === 1
                  ? "1 correct"
                  : question.orientation 
                    ? `${question.orientation} orientation`
                    : "0 correct"}
              </span>
              <span>{question.options.length} opts</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}