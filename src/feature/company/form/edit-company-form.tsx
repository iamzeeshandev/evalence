"use client";

import { UpdateCompanyPayload } from "@/services/rtk-query/company/company-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Field } from "../../../components/core/hook-form";
import { Button } from "../../../components/ui/button";
import { Form } from "../../../components/ui/form";
import { cn } from "../../../lib/utils";

const companySchema = z.object({
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
    .min(1, { message: "Email address required" })
    .email({ message: "Invalid email format" }),
  role: z.string().min(1, { message: "Role is required" }),
  companyName: z
    .string()
    .min(1, { message: "Company name is required" })
    .min(2, { message: "Company name must be at least 2 characters" }),
  companyPhone: z
    .string()
    .min(1, { message: "Company phone is required" })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" }),
});

interface EditCompanyFormProps {
  className?: string;
  onClose: () => void;
  onSubmit: (values: z.infer<typeof companySchema>) => void;
  isLoading: boolean;
  company: UpdateCompanyPayload;
  props?: any;
}

export function EditCompanyForm({
  className,
  onSubmit,
  onClose,
  isLoading = false,
  company,
  ...props
}: EditCompanyFormProps) {
  // const [passwordVisibility, setPasswordVisibility] = useState(false);

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      firstName: company.firstName,
      lastName: company.lastName,
      email: company.email,
      role: company.role,
      companyName: company.companyName,
      companyPhone: company.companyPhone,
    },
  });

  const handleSubmit = async (values: z.infer<typeof companySchema>) => {
    try {
      await onSubmit(values);
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || "Update failed. Please try again.";
      console.error("Update failed:", errorMessage);

      form.setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  // const togglePasswordVisibility = () => {
  //   setPasswordVisibility(!passwordVisibility);
  // };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 max-h-[85vh] overflow-y-auto",
        className
      )}
      {...props}
    >
      <div className="p-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className={cn("space-y-6")}
          >
            <div className="flex flex-col items-start gap-2 text-start">
              <h2 className="text-2xl font-semibold">Edit Company</h2>
              <p className="text-sm text-muted-foreground">
                Update company information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field.Text
                name="firstName"
                label="First Name"
                placeholder="John"
                required
              />
              <Field.Text
                name="lastName"
                label="Last Name"
                placeholder="Doe"
                required
              />
            </div>

            <Field.Text
              name="email"
              label="Email"
              placeholder="your-email@company.com"
              type="email"
              required
            />

            {/* <Field.Text
              name="password"
              label="Password"
              type={passwordVisibility ? "text" : "password"}
              placeholder="Leave blank to keep current password"
              trailingIcon={
                passwordVisibility ? (
                  <EyeOff
                    className="h-5 w-5 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <Eye
                    className="h-5 w-5 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                )
              }
            /> */}

            <Field.Select
              name="role"
              label="Role"
              options={[
                { value: "company_admin", label: "Company Administrator" },
                { value: "company_user", label: "Company User" },
              ]}
              required
            />

            <Field.Text
              name="companyName"
              label="Company Name"
              placeholder="Acme Corporation"
              required
            />

            <Field.Text
              name="companyPhone"
              label="Company Phone"
              placeholder="+1234567890"
              type="text"
              required
            />

            {form.formState.errors.root && (
              <div className="text-sm text-red-600 font-medium">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Company"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
