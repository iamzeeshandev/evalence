"use client";

import { Field } from "@/components/core/hook-form";

export function TestBasicInfoForm() {
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
      </div>

      <Field.Textarea
        name="description"
        label="Description"
        placeholder="Enter assessment description"
      />

      <Field.Switch
        name="isActive"
        label="Active Assessment"
        description="Enable this assessment for use"
      />
    </div>
  );
}
