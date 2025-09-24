"use client";

import { Field } from "@/components/core/hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/services/rtk-query/auth/auth-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(1, { message: "Password required" })
    .min(8, { message: "Must be at least 8 characters" }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const [loginUserMut, { isLoading }] = useLoginMutation();
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const result = await loginUserMut({
        email: values.email,
        password: values.password,
      }).unwrap();
      if (result) {
        login(result);
      }
    } catch (err: any) {
      // Handle API errors - you can set form-level errors here if needed
      const errorMessage =
        err?.data?.message || "Login failed. Please try again.";
      console.error("Login failed:", errorMessage);

      // Optionally set a form-level error
      form.setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="shadow-lg border rounded-2xl p-8">
        <h1 className="text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
          Evalence
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-6")}
          >
            <div className="flex flex-col items-start gap-2 text-start">
              <h1 className="text-4xl font-semibold">LOGIN</h1>
            </div>

            <div className="space-y-4">
              <Field.Text
                name="email"
                label="Email"
                placeholder="your-email@domain.com"
                required
              />
              <Field.Text
                name="password"
                label="Password"
                type={passwordVisibility ? "text" : "password"}
                placeholder="Enter your password"
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
                required
              />
            </div>

            {form.formState.errors.root && (
              <div className="text-sm text-red-600 font-medium">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2"></div>
              <a
                href="/forgot-password"
                className="cursor-pointer hover:text-red-500"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full mb-3" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login To Dashboard"}
            </Button>

            <div className="text-center text-sm">
              Create an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
