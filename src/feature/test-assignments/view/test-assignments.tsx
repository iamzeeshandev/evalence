"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Plus,
  Search,
  Users,
  Building,
  Clock,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  useAssignToCompanyMutation,
  useAssignToUserMutation,
  useGetAllTestAssignmentsQuery,
  useGetTestAssignmentByCompanyIdQuery,
  useGetUserTestAssignmentByCompanyIdQuery,
} from "@/services/rtk-query/test-assignment/test-assignment-api";
import {
  useGetAllCompaniesQuery,
  useGetAllTestsQuery,
  useGetAllUsersQuery,
} from "@/services/rtk-query";
import {
  AssignToUserPayload,
  TestAssignmentPayload,
} from "@/services/rtk-query/test-assignment/test-assignment-type";

export function TestAssignmentSystem() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("all"); // Updated default value
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assignmentType, setAssignmentType] = useState<"company" | "user">(
    "company"
  );

  const [selectedTest, setSelectedTest] = useState("");
  const [selectedCompanyForAssign, setSelectedCompanyForAssign] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [dueDate, setDueDate] = useState<Date>();

  // API queries based on user role
  const { data: allAssignments, isLoading: isLoadingAllAssignments } =
    useGetAllTestAssignmentsQuery(undefined, {
      skip: user?.role !== "super_admin",
    });

  const { data: companyAssignments, isLoading: isLoadingCompanyAssignments } =
    useGetTestAssignmentByCompanyIdQuery(user?.company.id || "", {
      skip: user?.role !== "company_admin" || !user?.company.id,
    });

  const { data: userAssignments, isLoading: isLoadingUserAssignments } =
    useGetUserTestAssignmentByCompanyIdQuery(
      { companyId: user?.company.id || "", userId: user?.id || "" },
      {
        skip: user?.role !== "employee" || !user?.company.id || !user?.id,
      }
    );

  // Supporting data
  const { data: tests } = useGetAllTestsQuery();
  const { data: companies } = useGetAllCompaniesQuery();
  const { data: users } = useGetAllUsersQuery();

  // Mutations
  const [assignToCompany] = useAssignToCompanyMutation();
  const [assignToUser] = useAssignToUserMutation();

  const getAssignmentsForRole = () => {
    switch (user?.role) {
      case "super_admin":
        return allAssignments || [];
      case "Company_Admin":
        return companyAssignments || [];
      case "Employee":
        return userAssignments || [];
      default:
        return [];
    }
  };

  const assignments = getAssignmentsForRole();
  const isLoading =
    isLoadingAllAssignments ||
    isLoadingCompanyAssignments ||
    isLoadingUserAssignments;

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.test.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCompany =
      selectedCompany === "all" || assignment.companyId === selectedCompany;

    return matchesSearch && matchesCompany;
  });

  const handleAssignTest = async () => {
    if (!selectedTest || !selectedCompanyForAssign || !dueDate) return;

    try {
      if (assignmentType === "company") {
        const payload: TestAssignmentPayload = {
          testId: selectedTest,
          companyId: selectedCompanyForAssign,
          maxAttempts,
          dueAt: dueDate.toISOString(),
        };
        await assignToCompany(payload).unwrap();
      } else {
        if (!selectedUser) return;
        const payload: AssignToUserPayload = {
          testId: selectedTest,
          companyId: selectedCompanyForAssign,
          userId: selectedUser,
          maxAttempts,
          dueAt: dueDate.toISOString(),
        };
        await assignToUser(payload).unwrap();
      }

      // Reset form
      setSelectedTest("");
      setSelectedCompanyForAssign("");
      setSelectedUser("");
      setMaxAttempts(1);
      setDueDate(undefined);
      setIsAssignDialogOpen(false);
    } catch (error) {
      console.error("Failed to assign test:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with role-specific actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            {user?.role === "super_admin" && "Test Assignments"}
            {user?.role === "Company_Admin" && "Company Test Assignments"}
            {user?.role === "Employee" && "My Test Assignments"}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === "super_admin" &&
              "Manage test assignments across all companies"}
            {user?.role === "Company_Admin" && "Assign tests to your employees"}
            {user?.role === "Employee" && "View your assigned tests"}
          </p>
        </div>

        {(user?.role === "super_admin" || user?.role === "Company_Admin") && (
          <Dialog
            open={isAssignDialogOpen}
            onOpenChange={setIsAssignDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Assign Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Assign Test</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Assignment Type - Only for Super Admin */}
                {user?.role === "super_admin" && (
                  <div className="space-y-2">
                    <Label>Assignment Type</Label>
                    <Select
                      value={assignmentType}
                      onValueChange={(value: "company" | "user") =>
                        setAssignmentType(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company">
                          Assign to Company
                        </SelectItem>
                        <SelectItem value="user">Assign to User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Test Selection */}
                <div className="space-y-2">
                  <Label>Select Test</Label>
                  <Select value={selectedTest} onValueChange={setSelectedTest}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a test" />
                    </SelectTrigger>
                    <SelectContent>
                      {tests?.map((test) => (
                        <SelectItem key={test.id} value={test.id}>
                          {test.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Selection */}
                <div className="space-y-2">
                  <Label>Select Company</Label>
                  <Select
                    value={selectedCompanyForAssign}
                    onValueChange={setSelectedCompanyForAssign}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {user?.role === "super_admin"
                        ? companies?.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))
                        : user?.company.id && (
                            <SelectItem value={user.company.id}>
                              {companies?.find((c) => c.id === user.company.id)
                                ?.name || "Your Company"}
                            </SelectItem>
                          )}
                    </SelectContent>
                  </Select>
                </div>

                {/* User Selection - Only for user assignment */}
                {assignmentType === "user" && (
                  <div className="space-y-2">
                    <Label>Select User</Label>
                    <Select
                      value={selectedUser}
                      onValueChange={setSelectedUser}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users
                          ?.filter(
                            (u) => u.companyId === selectedCompanyForAssign
                          )
                          .map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Max Attempts */}
                <div className="space-y-2">
                  <Label>Max Attempts</Label>
                  <Input
                    type="number"
                    min="1"
                    value={maxAttempts}
                    onChange={(e) =>
                      setMaxAttempts(Number.parseInt(e.target.value) || 1)
                    }
                  />
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button onClick={handleAssignTest} className="w-full">
                  Assign Test
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {user?.role === "super_admin" && (
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>{" "}
              {/* Updated value prop */}
              {companies?.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Assignment Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assignments
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Assignments
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignments.filter((a) => a.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.role === "super_admin"
                ? new Set(assignments.map((a) => a.companyId)).size
                : 1}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Max Attempts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignments.length > 0
                ? Math.round(
                    assignments.reduce((acc, a) => acc + a.maxAttempts, 0) /
                      assignments.length
                  )
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Listing */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {assignment.test.title}
                  </CardTitle>
                  <CardDescription>
                    {assignment.test.description}
                  </CardDescription>
                </div>
                <Badge variant={assignment.isActive ? "default" : "secondary"}>
                  {assignment.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Duration: {assignment.test.duration} minutes</span>
                  <span>{assignment.test.questions.length} questions</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Max Attempts: {assignment.maxAttempts}</span>
                  <span>
                    Due: {new Date(assignment.dueAt || "").toLocaleDateString()}
                  </span>
                </div>

                {/* Company and User info */}
                <div className="space-y-1 text-sm">
                  {assignment.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{assignment.company.name}</span>
                    </div>
                  )}
                  {"user" in assignment && assignment.user && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{assignment.user.name}</span>
                    </div>
                  )}
                </div>

                {/* Assignment dates */}
                <div className="text-xs text-muted-foreground">
                  <p>
                    Assigned:{" "}
                    {new Date(assignment.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    Updated:{" "}
                    {new Date(assignment.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm
                ? "No assignments match your search criteria."
                : "No test assignments available yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
