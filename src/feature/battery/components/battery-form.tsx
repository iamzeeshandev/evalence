"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Field } from "@/components/core/hook-form";
import { useSaveBatteryMutation, useUpdateBatteryMutation, useGetBatteryByIdQuery, useGetAllTestsQuery } from "@/services/rtk-query";
import { BatteryPayload } from "@/services/rtk-query/battery/battery-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";

const batterySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Battery name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  isActive: z.boolean(),
  testIds: z.array(z.string()).min(1, { message: "At least one test must be selected" }),
});

type BatteryFormData = z.infer<typeof batterySchema>;

export function BatteryForm() {
  const router = useRouter();
  const params = useParams();
  const batteryId = params?.id as string;
  const isEditMode = !!batteryId;

  const [saveBattery, { isLoading: isSaving }] = useSaveBatteryMutation();
  const [updateBattery, { isLoading: isUpdating }] = useUpdateBatteryMutation();
  const { data: batteryData, isLoading: isLoadingBattery } = useGetBatteryByIdQuery(batteryId, {
    skip: !isEditMode,
  });
  const { data: tests } = useGetAllTestsQuery();

  const isLoading = isSaving || isUpdating || isLoadingBattery;

  const testOptions = tests?.map(test => ({
    value: test.id,
    label: test.title
  })) || [];

  const form = useForm<BatteryFormData>({
    resolver: zodResolver(batterySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      testIds: [],
    },
  });

  useEffect(() => {
    if (isEditMode && batteryData) {
      form.reset({
        name: batteryData.name,
        description: batteryData.description || "",
        isActive: batteryData.isActive,
        testIds: batteryData.tests?.map(test => test.id) || [],
      });
    }
  }, [isEditMode, batteryData, form]);

  const onSubmit = async (values: BatteryFormData) => {
    try {
      const payload: BatteryPayload = {
        name: values.name,
        description: values.description,
        isActive: values.isActive,
        testIds: values.testIds,
      };

      if (isEditMode) {
        await updateBattery({ id: batteryId, payload }).unwrap();
      } else {
        await saveBattery(payload).unwrap();
      }

      router.push("/battery");
    } catch (err: any) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} battery:`,
        err?.data?.message || "An error occurred"
      );
      form.setError("root", {
        type: "manual",
        message:
          err?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} battery. Please try again.`,
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/battery">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create New Battery</h1>
        </div>
        <p className="text-muted-foreground">
          Create a new battery by filling in the details below
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Battery" : "Create New Battery"}</CardTitle>
          <CardDescription>
            {isEditMode ? "Update the battery details below." : "Fill in the details below to create a new battery."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <Field.Text
                  name="name"
                  label="Battery Name"
                  placeholder="Enter battery name"
                  required
                />
                
                <Field.Textarea
                  name="description"
                  label="Description"
                  placeholder="Enter battery description (optional)"
                />

                <Field.Select
                  name="testIds"
                  label="Tests"
                  placeholder="Select tests to include in the battery"
                  options={testOptions}
                  multiple
                  required
                />

                <Field.Switch
                  name="isActive"
                  label="Active Status"
                  description="Enable this battery for use"
                />
              </div>

              {form.formState.errors.root && (
                <div className="text-sm text-red-600 font-medium">
                  {form.formState.errors.root.message}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Battery" : "Create Battery")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/battery")}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
