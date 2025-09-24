"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Field } from "@/components/core/hook-form";
import { useSaveGroupMutation, useUpdateGroupMutation, useGetGroupByIdQuery, useGetAllUsersQuery, useGetCompaniesDropdownQuery } from "@/services/rtk-query";
import { GroupPayload } from "@/services/rtk-query/groups/groups-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";

const groupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Group name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  isActive: z.boolean(),
  userIds: z.array(z.string()).min(1, { message: "At least one user must be selected" }),
  companyId: z.string().optional(),
});

type GroupFormData = z.infer<typeof groupSchema>;

export function GroupForm() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id as string;
  const isEditMode = !!groupId;

  const [saveGroup, { isLoading: isSaving }] = useSaveGroupMutation();
  const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation();
  const { data: groupData, isLoading: isLoadingGroup } = useGetGroupByIdQuery(groupId, {
    skip: !isEditMode,
  });
  const { data: users } = useGetAllUsersQuery();
  const { data: companies, isLoading: isLoadingCompanies } = useGetCompaniesDropdownQuery();

  const isLoading = isSaving || isUpdating || isLoadingGroup || isLoadingCompanies;

  const userOptions = users?.map(user => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName} (${user.email})`
  })) || [];

  const companyOptions = companies?.map(company => ({
    value: company.id,
    label: company.name
  })) || [];

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      userIds: [],
      companyId: "",
    },
  });

  useEffect(() => {
    if (isEditMode && groupData) {
      form.reset({
        name: groupData.name,
        description: groupData.description || "",
        isActive: groupData.isActive,
        userIds: groupData.users?.map(user => user.id) || [],
        companyId: groupData.company?.id || "",
      });
    }
  }, [isEditMode, groupData, form]);

  const onSubmit = async (values: GroupFormData) => {
    try {
      const payload: GroupPayload = {
        name: values.name,
        description: values.description,
        isActive: values.isActive,
        userIds: values.userIds,
        companyId: values.companyId,
      };

      if (isEditMode) {
        await updateGroup({ id: groupId, payload }).unwrap();
      } else {
        await saveGroup(payload).unwrap();
      }

      router.push("/company-management/groups");
    } catch (err: any) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} group:`,
        err?.data?.message || "An error occurred"
      );
      form.setError("root", {
        type: "manual",
        message:
          err?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} group. Please try again.`,
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/company-management/groups">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create New Group</h1>
        </div>
        <p className="text-muted-foreground">
          Create a new group and add users to it
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Group" : "Create New Group"}</CardTitle>
          <CardDescription>
            {isEditMode ? "Update the group details below." : "Fill in the details below to create a new group."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <Field.Text
                  name="name"
                  label="Group Name"
                  placeholder="Enter group name"
                  required
                />
                
                <Field.Textarea
                  name="description"
                  label="Description"
                  placeholder="Enter group description (optional)"
                />

                <Field.Select
                  name="companyId"
                  label="Company"
                  placeholder="Select company (optional)"
                  options={companyOptions}
                  disabled={isLoadingCompanies}
                />

                <Field.Select
                  name="userIds"
                  label="Group Members"
                  placeholder="Select users to add to the group"
                  options={userOptions}
                  multiple
                  required
                />

                <Field.Switch
                  name="isActive"
                  label="Active Status"
                  description="Enable this group for use"
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
                  {isLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Group" : "Create Group")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/company-management/groups")}
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
