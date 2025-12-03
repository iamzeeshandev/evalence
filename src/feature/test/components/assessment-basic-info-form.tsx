"use client";

import { Field } from "@/components/core/hook-form";
import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

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

  const {
    fields: likertFields,
    append: appendLikert,
    remove: removeLikert,
  } = useFieldArray({
    name: "likertScale",
    control: form.control,
  });

  const assessmentOptions = [
    { value: "mcqs", label: "Multiple Choice Questions" },
    { value: "pictorial", label: "Pictorial" },
    { value: "boolean", label: "True & False" },
    { value: "psychometric", label: "Psychometric" },
  ];

  // Initialize default Likert scale for psychometric tests
  useEffect(() => {
    if (isPsychometric) {
      const currentLikertScale = form.getValues("likertScale");
      if (!currentLikertScale || currentLikertScale.length === 0) {
        const defaultLikertScale = [
          { label: "Strongly disagree", value: 1 },
          { label: "Disagree", value: 2 },
          { label: "Neither agree nor disagree", value: 3 },
          { label: "Agree", value: 4 },
          { label: "Strongly agree", value: 5 },
        ];
        form.setValue("likertScale", defaultLikertScale);
        form.setValue("likertMin", 1);
        form.setValue("likertMax", 5);
      }
    }
  }, [isPsychometric, form]);

  const addDefaultOption = () => {
    appendOption({ text: "", score: 0 });
  };

  const updateOption = (index: number, field: "text" | "score", value: string | number) => {
    form.setValue(`psychometricConfig.defaultOptions.${index}.${field}`, value);
  };

  const addLikertItem = () => {
    const currentMax = form.getValues("likertMax") || 5;
    appendLikert({ label: "", value: currentMax + 1 });
    form.setValue("likertMax", currentMax + 1);
  };

  const updateLikertItem = (index: number, field: "label" | "value", value: string | number) => {
    form.setValue(`likertScale.${index}.${field}`, value);
    // Update min/max if needed
    const likertScale = form.getValues("likertScale") || [];
    if (likertScale.length > 0) {
      const values = likertScale.map((item: any) => item.value).filter((v: any) => v !== undefined);
      if (values.length > 0) {
        form.setValue("likertMin", Math.min(...values));
        form.setValue("likertMax", Math.max(...values));
      }
    }
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
        required
      />

      {/* Psychometric Configuration */}
      {isPsychometric && (
        <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
          <h3 className="text-sm font-semibold text-blue-900">
            Psychometric Test Configuration
          </h3>
          
          {/* Likert Scale Configuration */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Likert Scale Options
            </label>
            <p className="text-xs text-gray-600">
              Define the response scale for all questions in this test.
            </p>
            
            {likertFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <input
                  type="number"
                  value={form.watch(`likertScale.${index}.value`) || ""}
                  onChange={(e) => updateLikertItem(index, "value", parseInt(e.target.value) || 0)}
                  placeholder="Value"
                  className="w-20 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <input
                  value={form.watch(`likertScale.${index}.label`) || ""}
                  onChange={(e) => updateLikertItem(index, "label", e.target.value)}
                  placeholder={`Label ${index + 1}`}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                />
                
                {likertFields.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      removeLikert(index);
                      const likertScale = form.getValues("likertScale") || [];
                      if (likertScale.length > 0) {
                        const values = likertScale.map((item: any) => item.value).filter((v: any) => v !== undefined);
                        if (values.length > 0) {
                          form.setValue("likertMin", Math.min(...values));
                          form.setValue("likertMax", Math.max(...values));
                        }
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              onClick={addLikertItem}
              variant="outline"
              className="w-full"
              type="button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Likert Scale Option
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