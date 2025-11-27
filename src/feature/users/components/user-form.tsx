"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Field } from "@/components/core/hook-form";
import {
  useSaveUserMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
  useGetCompaniesDropdownQuery,
  useGetMyCompaniesDropdownQuery,
} from "@/services/rtk-query";
import { UserPayload, UserRole } from "@/services/rtk-query/users/users-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import { useAuth } from "@/lib/auth";

const userSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  role: z.nativeEnum(UserRole),
  phone: z.string().optional(),
  companyId: z.string().min(1, { message: "Company is required" }),
});

type UserFormData = z.infer<typeof userSchema>;

const roleOptions = [
  { value: UserRole.ADMIN, label: "Admin" },
  { value: UserRole.COMPANY_ADMIN, label: "Company Admin" },
  { value: UserRole.EMPLOYEE, label: "Employee" },
];

// Create company options for dropdown
const getCompanyOptions = (companies: any[]) => {
  return companies?.map((company) => ({
    value: company.id,
    label: company.name,
  })) || [];
};

export function UserForm() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const isEditMode = !!userId;
  const { authData } = useAuth();
  
  // Determine if the current user is a super admin
  const isSuperAdmin = authData.user?.role === "super_admin";

  const [saveUser, { isLoading: isSaving }] = useSaveUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data: userData, isLoading: isLoadingUser } = useGetUserByIdQuery(
    userId,
    {
      skip: !isEditMode,
    }
  );
  
  // Use different company dropdown queries based on user role
  const { data: allCompanies, isLoading: isLoadingAllCompanies } = useGetCompaniesDropdownQuery(undefined, {
    skip: !isSuperAdmin
  });
  
  const { data: myCompanies, isLoading: isLoadingMyCompanies } = useGetMyCompaniesDropdownQuery(undefined, {
    skip: isSuperAdmin
  });
  
  // Use appropriate companies data based on user role
  const companies = isSuperAdmin ? allCompanies : myCompanies;
  const isLoadingCompanies = isSuperAdmin ? isLoadingAllCompanies : isLoadingMyCompanies;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: UserRole.EMPLOYEE,
      phone: "",
      companyId: "",
    },
  });

  const isLoading = isSaving || isUpdating || isLoadingUser || isLoadingCompanies;

  useEffect(() => {
    if (isEditMode && userData) {
      form.reset({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: "",
        role: userData.role,
        phone: userData.phone || "",
        companyId: userData.company?.id || "",
      });
    }
  }, [isEditMode, userData, form]);

  const onSubmit = async (values: UserFormData) => {
    try {
      const payload: UserPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: values.role,
        phone: values.phone,
        companyId: values.companyId,
      };

      if (isEditMode) {
        await updateUser({ id: userId, ...payload }).unwrap();
      } else {
        await saveUser(payload).unwrap();
      }

      router.push("/company-management/users");
    } catch (err: any) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} user:`,
        err?.data?.message || "An error occurred"
      );
      form.setError("root", {
        type: "manual",
        message:
          err?.data?.message ||
          `Failed to ${
            isEditMode ? "update" : "create"
          } user. Please try again.`,
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/company-management/users">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create New User</h1>
        </div>
        <p className="text-muted-foreground">
          Create a new user by filling in the details below
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit User" : "Create New User"}</CardTitle>
          <CardDescription>
            {isEditMode
              ? "Update the user details below."
              : "Fill in the details below to create a new user account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field.Text
                  name="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  required
                />

                <Field.Text
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                  required
                />
              </div>

              <Field.Text
                name="email"
                label="Email"
                type="email"
                placeholder="Enter email address"
                required
              />

              <Field.Text
                name="password"
                label="Password"
                type="password"
                placeholder="Enter password"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field.Select
                  name="role"
                  label="Role"
                  placeholder="Select role"
                  options={roleOptions}
                  required
                />

                <Field.Text
                  name="phone"
                  label="Phone"
                  placeholder="Enter phone number (optional)"
                />
              </div>

              <Field.Select
                name="companyId"
                label="Company"
                placeholder="Select company"
                options={getCompanyOptions(companies || [])}
                required
                disabled={isLoadingCompanies}
              />

              {form.formState.errors.root && (
                <div className="text-sm text-red-600 font-medium">
                  {form.formState.errors.root.message}
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isEditMode
                    ? "Update User"
                    : "Create User"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/company-management/users")}
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