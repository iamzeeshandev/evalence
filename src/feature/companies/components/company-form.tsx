"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Field } from "@/components/core/hook-form";
import { useSaveCompanyMutation } from "@/services/rtk-query";
import { CompanyPayload } from "@/services/rtk-query/company/company-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const companySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Company name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  adminPassword: z
    .string()
    .min(1, { message: "Admin password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

const industryOptions = [
  { value: "Technology", label: "Technology" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Finance", label: "Finance" },
  { value: "Education", label: "Education" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Retail", label: "Retail" },
  { value: "Consulting", label: "Consulting" },
  { value: "Other", label: "Other" },
];

const sizeOptions = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
];

export function CompanyForm() {
  const router = useRouter();
  const [saveCompany, { isLoading }] = useSaveCompanyMutation();

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      description: "",
      email: "",
      adminPassword: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      website: "",
      industry: "",
      size: "",
    },
  });

  const onSubmit = async (values: CompanyFormData) => {
    try {
      const payload: CompanyPayload = {
        name: values.name,
        description: values.description,
        email: values.email,
        adminPassword: values.adminPassword,
        phone: values.phone,
        address: values.address,
        city: values.city,
        state: values.state,
        country: values.country,
        postalCode: values.postalCode,
        website: values.website,
        industry: values.industry,
        size: values.size,
      };
      
      await saveCompany(payload).unwrap();
      router.push("/company-management/companies");
    } catch (err: any) {
      console.error("Failed to create company:", err?.data?.message || "An error occurred");
      form.setError("root", {
        type: "manual",
        message: err?.data?.message || "Failed to create company. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/company-management/companies">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create New Company</h1>
        </div>
        <p className="text-muted-foreground">
          Create a new company by filling in the details below
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Provide the basic information for the company
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field.Text
                    name="name"
                    label="Company Name"
                    placeholder="Enter company name"
                    required
                  />
                  
                  <Field.Text
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter company email"
                    required
                  />
                </div>

                <Field.Text
                  name="adminPassword"
                  label="Admin Password"
                  type="password"
                  placeholder="Enter admin password"
                  required
                />

                <Field.Textarea
                  name="description"
                  label="Description"
                  placeholder="Enter company description (optional)"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field.Text
                    name="phone"
                    label="Phone"
                    placeholder="Enter phone number (optional)"
                  />
                  
                  <Field.Text
                    name="website"
                    label="Website"
                    placeholder="Enter website URL (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field.Select
                    name="industry"
                    label="Industry"
                    placeholder="Select industry (optional)"
                    options={industryOptions}
                  />
                  
                  <Field.Select
                    name="size"
                    label="Company Size"
                    placeholder="Select company size (optional)"
                    options={sizeOptions}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field.Text
                      name="address"
                      label="Address"
                      placeholder="Enter address (optional)"
                    />
                    
                    <Field.Text
                      name="city"
                      label="City"
                      placeholder="Enter city (optional)"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field.Text
                      name="state"
                      label="State"
                      placeholder="Enter state (optional)"
                    />
                    
                    <Field.Text
                      name="country"
                      label="Country"
                      placeholder="Enter country (optional)"
                    />
                    
                    <Field.Text
                      name="postalCode"
                      label="Postal Code"
                      placeholder="Enter postal code (optional)"
                    />
                  </div>
                </div>
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
                  {isLoading ? "Creating..." : "Create Company"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/company-management/companies")}
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
