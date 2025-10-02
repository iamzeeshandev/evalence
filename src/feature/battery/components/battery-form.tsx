"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Field } from "@/components/core/hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSaveBatteryMutation, useUpdateBatteryMutation, useGetBatteryByIdQuery, useGetAllTestsQuery } from "@/services/rtk-query";
import { BatteryPayload, BatteryTestPayload } from "@/services/rtk-query/battery/battery-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";

const batterySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Battery name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  isActive: z.boolean(),
  tests: z.array(z.object({
    testId: z.string(),
    weight: z.number().min(1, { message: "Weight must be at least 1%" }).max(100, { message: "Weight cannot exceed 100%" })
  })).min(1, { message: "At least one test must be selected" }),
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

  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const [testWeight, setTestWeight] = useState<string>("");

  const isLoading = isSaving || isUpdating || isLoadingBattery;

  const form = useForm<BatteryFormData>({
    resolver: zodResolver(batterySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      tests: [],
    },
  });

  const selectedTests = form.watch("tests");
  const totalWeight = selectedTests.reduce((sum, test) => sum + test.weight, 0);
  const remainingWeight = 100 - totalWeight;

  useEffect(() => {
    if (isEditMode && batteryData) {
      // Convert batteryTests to the form format
      const testsWithWeights = batteryData.batteryTests?.map((batteryTest) => ({
        testId: batteryTest.testId,
        weight: parseInt(batteryTest.weight)
      })) || [];
      
      form.reset({
        name: batteryData.name,
        description: batteryData.description || "",
        isActive: batteryData.isActive,
        tests: testsWithWeights,
      });
    }
  }, [isEditMode, batteryData, form]);

  const availableTests = tests?.filter(test => 
    !selectedTests.some(selected => selected.testId === test.id)
  ) || [];

  const testOptions = tests?.map(test => ({
    value: test.id,
    label: test.title
  })) || [];

  const addTest = () => {
    if (!selectedTestId || !testWeight) return;
    
    const weight = parseInt(testWeight);
    if (weight <= 0 || weight > remainingWeight) return;

    const currentTests = form.getValues("tests");
    const newTest: BatteryTestPayload = {
      testId: selectedTestId,
      weight: weight
    };

    form.setValue("tests", [...currentTests, newTest]);
    setSelectedTestId("");
    setTestWeight("");
  };

  const removeTest = (testId: string) => {
    const currentTests = form.getValues("tests");
    form.setValue("tests", currentTests.filter(test => test.testId !== testId));
  };

  const updateTestWeight = (testId: string, newWeight: number) => {
    const currentTests = form.getValues("tests");
    const updatedTests = currentTests.map(test => 
      test.testId === testId ? { ...test, weight: newWeight } : test
    );
    form.setValue("tests", updatedTests);
  };

  const onSubmit = async (values: BatteryFormData) => {
    // Validate total weight is 100%
    if (totalWeight !== 100) {
      form.setError("tests", {
        type: "manual",
        message: "Total weight must equal 100%",
      });
      return;
    }

    try {
      const payload: BatteryPayload = {
        name: values.name,
        description: values.description,
        isActive: values.isActive,
        tests: values.tests,
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

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Tests & Weightage</Label>
                  
                  {/* Test Selection */}
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Select Test</Label>
                        <Select value={selectedTestId} onValueChange={(value: string) => setSelectedTestId(value)}>
                          <SelectTrigger className="w-full mb-0">
                            <SelectValue placeholder="Choose a test" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {availableTests.map((test) => (
                              <SelectItem key={test.id} value={test.id}>
                                {test.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Weight (%)</Label>
                        <Input
                          type="number"
                          min="1"
                          max={remainingWeight}
                          value={testWeight}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestWeight(e.target.value)}
                          placeholder="Enter weight"
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="h-5"></div>
                        <Button
                          type="button"
                          onClick={addTest}
                          disabled={!selectedTestId || !testWeight || parseInt(testWeight) <= 0 || parseInt(testWeight) > remainingWeight}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Test
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Info Bar - Show when at least 1 test is added */}
                  {selectedTests.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-sky-10 border border-sky-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Total Weight:</span>
                        <Badge variant={totalWeight === 100 ? "default" : "destructive"}>
                          {totalWeight}%
                        </Badge>
                        {totalWeight === 100 && (
                          <span className="text-sm text-green-600 font-medium">✓ Complete</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Remaining: {remainingWeight}%
                      </div>
                    </div>
                  )}

                  {/* Selected Tests */}
                  {selectedTests.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Selected Tests ({selectedTests.length})</Label>
                      <div className="space-y-2">
                        {selectedTests.map((test) => {
                          const testData = tests?.find(t => t.id === test.testId);
                          return (
                            <div key={test.testId} className="flex items-center gap-3 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{testData?.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {testData?.duration} mins
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={test.weight}
                                    onChange={(e) => updateTestWeight(test.testId, parseInt(e.target.value) || 0)}
                                    className="w-16 h-8 text-sm text-center"
                                  />
                                  <span className="text-xs text-muted-foreground">%</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeTest(test.testId)}
                                  className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Validation Error */}
                  {form.formState.errors.tests && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">
                        {form.formState.errors.tests.message}
                      </span>
                    </div>
                  )}
                </div>

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
