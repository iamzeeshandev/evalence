"use client";

import { Field } from "@/components/core/hook-form";
import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

export function TestBasicInfoForm() {
  const form = useFormContext();
  const testType = form.watch("type");
  const isPsychometric = testType === "psychometric";

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    name: "psychometricConfig.defaultOptions",
    control: form.control,
  });

  const assessmentOptions = [
    { value: "mcqs", label: "Multiple Choice Questions" },
    { value: "pictorial", label: "Pictorial" },
    { value: "boolean", label: "True & False" },
    { value: "psychometric", label: "Psychometric" },
  ];

  const addDefaultOption = () => {
    appendOption({ text: "", score: 0 });
  };

  const updateOption = (index: number, field: "text" | "score", value: string | number) => {
    form.setValue(`psychometricConfig.defaultOptions.${index}.${field}`, value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Field.Text
          name="title"
          label="Assessment Title"
          placeholder="Enter Assessment title"
          required
        />

        <Field.Text
          name="duration"
          label="Duration (minutes)"
          placeholder="60"
          type="number"
          required
        />

        <Field.Select
          name="type"
          label="Assessment Type"
          placeholder="Select assessment type"
          options={assessmentOptions}
          required
        />
      </div>

      <Field.Textarea
        name="description"
        label="Description"
        placeholder="Enter assessment description"
      />

      {/* Psychometric Configuration */}
      {isPsychometric && (
        <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
          <h3 className="text-sm font-semibold text-blue-900">
            Psychometric Test Configuration
          </h3>
          
          <Field.Text
            name="psychometricConfig.scoringStandard"
            label="Scoring Standard"
            placeholder="e.g., 1-5 Likert Scale, 1-7 Scale"
            description="Define the scoring range for this test"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Default Response Options
            </label>
            <p className="text-xs text-gray-600">
              These options will be used for all questions in this test. You can customize individual questions later.
            </p>
            
            {optionFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <input
                  value={form.watch(`psychometricConfig.defaultOptions.${index}.text`) || ""}
                  onChange={(e) => updateOption(index, "text", e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                />
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm whitespace-nowrap">Score:</label>
                  <input
                    type="number"
                    value={form.watch(`psychometricConfig.defaultOptions.${index}.score`) || 0}
                    onChange={(e) => updateOption(index, "score", parseInt(e.target.value) || 0)}
                    className="w-20 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="0"
                  />
                </div>
                
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
            ))}
            
            <Button
              onClick={addDefaultOption}
              variant="outline"
              className="w-full"
              type="button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        </div>
      )}

      <Field.Switch
        name="isActive"
        label="Active Assessment"
        description="Enable this assessment for use"
      />
    </div>
  );
}