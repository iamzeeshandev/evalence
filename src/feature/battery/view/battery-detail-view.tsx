"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Field } from "@/components/core/hook-form";
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetBatteryByIdQuery, useAssignBatteryToGroupsMutation, useGetGroupsDropdownQuery, useGetAllTestsQuery, useAddTestsToBatteryMutation, useRemoveTestsFromBatteryMutation, useCreateMultipleBatteryAssignmentsMutation, useGetBatteryAssignmentsByBatteryIdQuery, useGetBatteryAssignmentsWithGroupsQuery } from "@/services/rtk-query";
import { BatteryTestPayload } from "@/services/rtk-query/battery/battery-type";
import { MultipleBatteryAssignmentPayload } from "@/services/rtk-query/battery-assignment/battery-assignment-type";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2, Plus, Minus, Settings, Users, TestTube, X, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type AssignGroupsForm = {
  groupIds: string[];
  groupNotes: { [groupId: string]: string };
};

type AddTestForm = {
  tests: BatteryTestPayload[];
};

type RemoveTestForm = {
  tests: BatteryTestPayload[];
};

export function BatteryDetailView() {
  const params = useParams();
  const router = useRouter();
  const batteryId = params?.id as string;

  const { data: battery, isLoading } = useGetBatteryByIdQuery(batteryId, {
    skip: !batteryId,
  });

  const { data: groups } = useGetGroupsDropdownQuery();
  const { data: tests } = useGetAllTestsQuery();
  const { data: batteryAssignments } = useGetBatteryAssignmentsByBatteryIdQuery(batteryId, {
    skip: !batteryId,
  });
  const { data: batteryAssignmentsWithGroups } = useGetBatteryAssignmentsWithGroupsQuery(batteryId, {
    skip: !batteryId,
  });
  const [assignToGroups, { isLoading: isAssigning }] = useAssignBatteryToGroupsMutation();
  const [addTests, { isLoading: isAddingTests }] = useAddTestsToBatteryMutation();
  const [removeTests, { isLoading: isRemovingTests }] = useRemoveTestsFromBatteryMutation();
  const [createMultipleAssignments, { isLoading: isCreatingAssignments }] = useCreateMultipleBatteryAssignmentsMutation();

  const [isAddTestDialogOpen, setIsAddTestDialogOpen] = useState(false);
  const [isRemoveTestDialogOpen, setIsRemoveTestDialogOpen] = useState(false);
  const [selectedTestToRemove, setSelectedTestToRemove] = useState<string | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const [testWeight, setTestWeight] = useState<string>("");

  const groupsForm = useForm<AssignGroupsForm>({
    defaultValues: { 
      groupIds: [], 
      groupNotes: {} 
    },
  });

  const addTestForm = useForm<AddTestForm>({
    defaultValues: { tests: [] },
  });

  const removeTestForm = useForm<RemoveTestForm>({
    defaultValues: { tests: [] },
  });

  useEffect(() => {
    // If backend returns battery groups in future, prefill here
  }, [battery]);

  const groupOptions = (groups || []).map((g) => ({ value: g.id, label: g.name }));
  
  // Filter out already assigned groups from the available groups list
  const assignedGroupIds = batteryAssignmentsWithGroups?.map((assignment: any) => assignment.groupId) || [];
  const availableGroupOptions = groupOptions.filter(group => !assignedGroupIds.includes(group.value));
  
  const availableTests = tests?.filter(test => 
    !battery?.batteryTests?.some(bt => bt.testId === test.id)
  ) || [];

  const totalWeight = battery?.batteryTests?.reduce((sum, bt) => sum + parseFloat(bt.weight), 0) || 0;
  const remainingWeight = 100 - totalWeight;

  // Form state for add test dialog
  const dialogTests = addTestForm.watch("tests");
  const dialogTotalWeight = dialogTests.reduce((sum, test) => sum + test.weight, 0);
  const dialogRemainingWeight = 100 - dialogTotalWeight;

  // Form state for remove test dialog
  const removeDialogTests = removeTestForm.watch("tests");
  const removeDialogTotalWeight = removeDialogTests.reduce((sum, test) => sum + test.weight, 0);

  // Form state for group assignment
  const selectedGroupIds = groupsForm.watch("groupIds");
  const groupNotes = groupsForm.watch("groupNotes");

  const handleAssignGroups = async (values: AssignGroupsForm) => {
    if (!batteryId) return;
    
    const payload: MultipleBatteryAssignmentPayload = {
      batteryId,
      groups: values.groupIds.map(groupId => ({
        groupId,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        notes: values.groupNotes[groupId] || undefined
      }))
    };
    
    await createMultipleAssignments(payload).unwrap();
    groupsForm.reset();
  };

  const handleAddTest = async (values: AddTestForm) => {
    if (!batteryId) return;
    
    // Validate total weight is 100%
    if (dialogTotalWeight !== 100) {
      addTestForm.setError("tests", {
        type: "manual",
        message: "Total weight must equal 100%",
      });
      return;
    }

    await addTests({ id: batteryId, tests: values.tests }).unwrap();
    setIsAddTestDialogOpen(false);
    addTestForm.reset();
    setSelectedTestId("");
    setTestWeight("");
  };

  const addTestToDialog = () => {
    if (!selectedTestId || !testWeight) return;
    
    const weight = parseInt(testWeight);
    if (weight <= 0 || weight > dialogRemainingWeight) return;

    const currentTests = addTestForm.getValues("tests");
    const newTest: BatteryTestPayload = {
      testId: selectedTestId,
      weight: weight
    };

    addTestForm.setValue("tests", [...currentTests, newTest]);
    setSelectedTestId("");
    setTestWeight("");
  };

  const removeTestFromDialog = (testId: string) => {
    const currentTests = addTestForm.getValues("tests");
    addTestForm.setValue("tests", currentTests.filter(test => test.testId !== testId));
  };

  const updateTestWeightInDialog = (testId: string, newWeight: number) => {
    const currentTests = addTestForm.getValues("tests");
    const updatedTests = currentTests.map(test => 
      test.testId === testId ? { ...test, weight: newWeight } : test
    );
    addTestForm.setValue("tests", updatedTests);
  };

  const handleRemoveTest = async (values: RemoveTestForm) => {
    if (!batteryId) return;
    
    // Validate total weight is 100%
    if (removeDialogTotalWeight !== 100) {
      removeTestForm.setError("tests", {
        type: "manual",
        message: "Total weight must equal 100%",
      });
      return;
    }

    // Validate at least one test remains
    if (values.tests.length === 0) {
      removeTestForm.setError("tests", {
        type: "manual",
        message: "At least one test must remain in the battery",
      });
      return;
    }

    await removeTests({ id: batteryId, tests: values.tests }).unwrap();
    setIsRemoveTestDialogOpen(false);
    setSelectedTestToRemove(null);
  };

  const removeTestFromRemoveDialog = (testId: string) => {
    const currentTests = removeTestForm.getValues("tests");
    removeTestForm.setValue("tests", currentTests.filter(test => test.testId !== testId));
  };

  const updateTestWeightInRemoveDialog = (testId: string, newWeight: number) => {
    const currentTests = removeTestForm.getValues("tests");
    const updatedTests = currentTests.map(test => 
      test.testId === testId ? { ...test, weight: newWeight } : test
    );
    removeTestForm.setValue("tests", updatedTests);
  };

  const updateGroupNote = (groupId: string, note: string) => {
    const currentNotes = groupsForm.getValues("groupNotes");
    groupsForm.setValue("groupNotes", {
      ...currentNotes,
      [groupId]: note
    });
  };

  // Initialize dialog with current battery tests when opened
  useEffect(() => {
    if (isAddTestDialogOpen && battery) {
      const currentTests = battery.batteryTests?.map(bt => ({
        testId: bt.testId,
        weight: parseFloat(bt.weight)
      })) || [];
      addTestForm.setValue("tests", currentTests);
    }
  }, [isAddTestDialogOpen, battery, addTestForm]);

  // Initialize remove dialog with current battery tests when opened
  useEffect(() => {
    if (isRemoveTestDialogOpen && battery) {
      const currentTests = battery.batteryTests?.map(bt => ({
        testId: bt.testId,
        weight: parseFloat(bt.weight)
      })) || [];
      removeTestForm.setValue("tests", currentTests);
    }
  }, [isRemoveTestDialogOpen, battery, removeTestForm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!battery) {
    return (
      <div className="p-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/battery")} className="h-8 w-8 mb-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <p className="text-muted-foreground">Battery not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/battery")} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{battery.name}</h1>
        <Badge variant={battery.isActive ? "default" : "secondary"} className={battery.isActive ? "bg-green-600" : "bg-gray-400"}>
          {battery.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Main Content - 70/30 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Side - 70% - Data Display */}
        <div className="lg:col-span-7 space-y-4">
          {/* Battery Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Battery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Description</div>
                  <div className="text-sm font-medium">{battery.description || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total Tests</div>
                  <div className="text-sm font-medium">{battery.batteryTests?.length || 0} tests</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total Weight</div>
                  <div className="text-sm font-medium">{totalWeight.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Created</div>
                  <div className="text-sm font-medium">{new Date(battery.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tests List */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Tests ({battery.batteryTests?.length || 0})</CardTitle>
                <Dialog open={isAddTestDialogOpen} onOpenChange={setIsAddTestDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Test
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="min-w-[40vw] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Manage Battery Tests</DialogTitle>
                      <DialogDescription>
                        Add new tests and adjust weights. Total weight must equal 100%.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...addTestForm}>
                      <form onSubmit={addTestForm.handleSubmit(handleAddTest)} className="space-y-4">
                        {/* Test Selection */}
                        <div className="space-y-4">
                          <Label className="text-sm font-medium">Add New Test</Label>
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
                                  max={dialogRemainingWeight}
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
                                  onClick={addTestToDialog}
                                  disabled={!selectedTestId || !testWeight || parseInt(testWeight) <= 0 || parseInt(testWeight) > dialogRemainingWeight}
                                  className="w-full"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Test
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Weight Summary */}
                          {dialogTests.length > 0 && (
                            <div className="flex items-center justify-between p-3 bg-sky-10 border border-sky-200 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Total Weight:</span>
                                <Badge variant={dialogTotalWeight === 100 ? "default" : "destructive"}>
                                  {dialogTotalWeight}%
                                </Badge>
                                {dialogTotalWeight === 100 && (
                                  <span className="text-sm text-green-600 font-medium">✓ Complete</span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Remaining: {dialogRemainingWeight}%
                              </div>
                            </div>
                          )}

                          {/* Selected Tests */}
                          {dialogTests.length > 0 && (
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Battery Tests ({dialogTests.length})</Label>
                              <div className="space-y-2">
                                {dialogTests.map((test) => {
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
                                            onChange={(e) => updateTestWeightInDialog(test.testId, parseInt(e.target.value) || 0)}
                                            className="w-16 h-8 text-sm text-center"
                                          />
                                          <span className="text-xs text-muted-foreground">%</span>
                                        </div>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => removeTestFromDialog(test.testId)}
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
                          {addTestForm.formState.errors.tests && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm text-red-600">
                                {addTestForm.formState.errors.tests.message}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button type="submit" disabled={isAddingTests} className="flex-1">
                            {isAddingTests ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setIsAddTestDialogOpen(false)}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(battery.batteryTests || []).length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">No tests added</div>
                )}
                {(battery.batteryTests || []).map((batteryTest) => (
                  <div 
                    key={batteryTest.id} 
                    className="flex items-center justify-between p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => router.push(`/test/view/${batteryTest.testId}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{batteryTest.test.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {batteryTest.test.duration} mins • {batteryTest.weight}% weight
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {batteryTest.test.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTestToRemove(batteryTest.testId);
                          setIsRemoveTestDialogOpen(true);
                        }}
                        className="h-7 w-7 text-red-500 hover:bg-red-50"
                        disabled={battery.batteryTests?.length === 1}
                        title={battery.batteryTests?.length === 1 ? "Cannot remove the last test" : "Remove test"}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - 30% - Settings/Forms */}
        <div className="lg:col-span-3 space-y-4">
          {/* Assign to Groups */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                Group Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...groupsForm}>
                <form onSubmit={groupsForm.handleSubmit(handleAssignGroups)} className="space-y-4">
                  <Field.Select
                    name="groupIds"
                    label="Groups"
                    placeholder="Select groups"
                    options={availableGroupOptions}
                    multiple
                  />
                  
                  {/* Selected Groups with Individual Notes */}
                  {selectedGroupIds.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Assignment Notes</Label>
                      <div className="space-y-2">
                        {selectedGroupIds.map((groupId) => {
                          const group = groups?.find(g => g.id === groupId);
                          return (
                            <div key={groupId} className="p-3 border rounded-lg bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">{group?.name}</span>
                              </div>
                              <Input
                                placeholder={`Notes for ${group?.name} (optional)`}
                                value={groupNotes[groupId] || ""}
                                onChange={(e) => updateGroupNote(groupId, e.target.value)}
                                className="text-sm"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <Button type="submit" disabled={isCreatingAssignments || selectedGroupIds.length === 0} className="w-full">
                    {isCreatingAssignments ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Assigning...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Check className="h-4 w-4" /> Assign to {selectedGroupIds.length} Group{selectedGroupIds.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Current Assignments */}
          {batteryAssignmentsWithGroups && batteryAssignmentsWithGroups.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Current Assignments ({batteryAssignmentsWithGroups.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {batteryAssignmentsWithGroups.map((assignment: any) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{assignment.group?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Expires: {new Date(assignment.expiresAt).toLocaleDateString()}
                          {assignment.notes && ` • ${assignment.notes}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Assigned by: {assignment.assignedBy?.firstName} {assignment.assignedBy?.lastName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={assignment.status === "active" ? "default" : "secondary"}
                          className={assignment.status === "active" ? "bg-green-600" : "bg-gray-400"}
                        >
                          {assignment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Remove Test Dialog */}
      <Dialog open={isRemoveTestDialogOpen} onOpenChange={setIsRemoveTestDialogOpen}>
        <DialogContent className="min-w-[40vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Remove Tests from Battery</DialogTitle>
            <DialogDescription>
              Select tests to remove and adjust weights. Total weight must equal 100%. At least one test must remain.
            </DialogDescription>
          </DialogHeader>
          <Form {...removeTestForm}>
            <form onSubmit={removeTestForm.handleSubmit(handleRemoveTest)} className="space-y-4">
              {/* Weight Summary */}
              {removeDialogTests.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-sky-10 border border-sky-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Total Weight:</span>
                    <Badge variant={removeDialogTotalWeight === 100 ? "default" : "destructive"}>
                      {removeDialogTotalWeight}%
                    </Badge>
                    {removeDialogTotalWeight === 100 && (
                      <span className="text-sm text-green-600 font-medium">✓ Complete</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tests remaining: {removeDialogTests.length}
                  </div>
                </div>
              )}

              {/* Tests List */}
              {removeDialogTests.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Battery Tests ({removeDialogTests.length})</Label>
                  <div className="space-y-2">
                    {removeDialogTests.map((test) => {
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
                                onChange={(e) => updateTestWeightInRemoveDialog(test.testId, parseInt(e.target.value) || 0)}
                                className="w-16 h-8 text-sm text-center"
                              />
                              <span className="text-xs text-muted-foreground">%</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTestFromRemoveDialog(test.testId)}
                              className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                              disabled={removeDialogTests.length === 1}
                              title={removeDialogTests.length === 1 ? "Cannot remove the last test" : "Remove test"}
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
              {removeTestForm.formState.errors.tests && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">
                    {removeTestForm.formState.errors.tests.message}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={isRemovingTests || removeDialogTests.length === 0} className="flex-1">
                  {isRemovingTests ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsRemoveTestDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


