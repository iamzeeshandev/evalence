"use client";

import { Field } from "@/components/core/hook-form";
import { Button } from "@/components/ui/button";
import { useFileUploadMutation } from "@/services/rtk-query/file/file-api";
import { ImageIcon, Plus, Trash2, Upload, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface QuestionCreationFormProps {
  onAddQuestion: () => void;
  isEditing: boolean;
  onCancelEdit: () => void;
}

export function QuestionCreationForm({
  onAddQuestion,
  isEditing,
  onCancelEdit,
}: QuestionCreationFormProps) {
  const form = useFormContext();
  const [uploadFileMutation] = useFileUploadMutation();

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    name: "currentQuestion.options",
    control: form.control,
  });

  const currentQuestion = form.watch("currentQuestion");
  const questions = form.watch("questions");
  const testType = form.watch("type");
  const psychometricConfig = form.watch("psychometricConfig");
  const nextQuestionNumber = questions.length + 1;
  
  const isPsychometric = testType === "psychometric";

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadFileMutation({ image: file });
      form.setValue("currentQuestion.imageUrl", response.data?.imageUrl || "");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const removeImage = () => {
    form.setValue("currentQuestion.imageUrl", "");
  };

  const addOption = () => {
    appendOption({ text: "", isCorrect: false, score: 0 });
  };

  const updateOption = (
    index: number,
    field: "text" | "isCorrect" | "score",
    value: string | boolean | number
  ) => {
    const currentOptions = form.getValues("currentQuestion.options");

    if (field === "isCorrect" && value === true) {
      // Only one correct answer allowed
      const updatedOptions = currentOptions.map((option: any, i: number) => ({
        ...option,
        isCorrect: i === index,
      }));
      form.setValue("currentQuestion.options", updatedOptions);
    } else {
      form.setValue(`currentQuestion.options.${index}.${field}`, value);
    }
  };

  const resetCurrentQuestion = () => {
    form.setValue("currentQuestion", {
      text: "",
      type: "single" as const,
      points: isPsychometric ? undefined : 5,
      imageUrl: "",
      options: isPsychometric && psychometricConfig?.defaultOptions?.length 
        ? psychometricConfig.defaultOptions.map((opt: { text: string; score: number }) => ({
            text: opt.text,
            isCorrect: false,
            score: opt.score,
          }))
        : [
            { text: "", isCorrect: false, score: 0 },
            { text: "", isCorrect: false, score: 0 },
            { text: "", isCorrect: false, score: 0 },
            { text: "", isCorrect: false, score: 0 },
          ],
      orientation: undefined,
      dimension: "",
    });
  };

  const handleCancel = () => {
    resetCurrentQuestion();
    onCancelEdit();
  };

  return (
    <div className="space-y-4">
      <Field.Textarea
        name="currentQuestion.text"
        label="Question Text"
        placeholder="Enter your question here"
        onBlur={() => form.trigger("currentQuestion.text")}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Question Image (Optional)
        </label>
        {currentQuestion?.imageUrl ? (
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
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <div className="mt-4">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <Upload className="h-4 w-4" />
                    Click to upload image
                  </div>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {!isPsychometric && (
        <Field.Text
          name="currentQuestion.points"
          label="Points"
          type="number"
          className="w-24"
        />
      )}

      {/* Psychometric-specific fields */}
      {isPsychometric && (
        <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
          <h3 className="text-sm font-semibold text-blue-900">
            Psychometric Settings
          </h3>
          
          <Field.Select
            name="currentQuestion.orientation"
            label="Question Orientation"
            placeholder="Select orientation"
            options={[
              { value: "straight", label: "Straight (1-5 scoring)" },
              { value: "reverse", label: "Reverse (5-1 scoring)" },
            ]}
            required
          />

          <Field.Text
            name="currentQuestion.dimension"
            label="Question Dimension (Optional)"
            placeholder="e.g., Extraversion, Neuroticism"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {isPsychometric ? "Response Options" : "Answer Options"}
        </label>
        {optionFields.map((field, index) => (
          <div key={field.id}>
            <div className="flex items-center space-x-2">
              <input
                value={currentQuestion?.options?.[index]?.text || ""}
                onChange={(e) => updateOption(index, "text", e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                onBlur={() => form.trigger(`currentQuestion.options`)}
              />
              
              {isPsychometric ? (
                <div className="flex items-center space-x-2">
                  <label className="text-sm whitespace-nowrap">Score:</label>
                  <input
                    type="number"
                    value={currentQuestion?.options?.[index]?.score || 0}
                    onChange={(e) =>
                      updateOption(index, "score", parseInt(e.target.value) || 0)
                    }
                    className="w-20 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="0"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={
                      currentQuestion?.options?.[index]?.isCorrect || false
                    }
                    onChange={(e) =>
                      updateOption(index, "isCorrect", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <label className="text-sm">Correct</label>
                </div>
              )}
              
              {optionFields.length > 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeOption(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {(form.formState.errors.currentQuestion as any)?.options?.[index]
              ?.text && (
              <p className="text-red-500 text-sm">
                {
                  (form.formState.errors.currentQuestion as any)?.options[index]
                    ?.text?.message
                }
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add Option Button */}
      <Button
        onClick={addOption}
        variant="outline"
        className="w-full"
        type="button"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Option
      </Button>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={onAddQuestion} className="flex-1" type="button">
          <Plus className="h-4 w-4 mr-2" />
          {isEditing ? "Update Question" : `Add Question ${nextQuestionNumber}`}
        </Button>

        {isEditing && (
          <Button onClick={handleCancel} variant="outline" type="button">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
