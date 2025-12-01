"use client";

import { Field } from "@/components/core/hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/services/rtk-query/auth/auth-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Chrome } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginUserMut, { isLoading }] = useLoginMutation();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check for Google auth errors in URL parameters
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      let message = "Login failed. Please try again.";
      
      switch (error) {
        case "google_auth_failed":
          message = "Google authentication failed. Please try again.";
          break;
        case "invalid_token":
          message = "Invalid authentication token. Please try again.";
          break;
        case "invalid_callback":
          message = "Authentication callback failed. Please try again.";
          break;
        default:
          message = "Login failed. Please try again.";
      }
      
      setErrorMessage(message);
      
      // Remove error param from URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("error");
      router.replace(`/auth/sign-in?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

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

  const handleGoogleSignIn = () => {
    // Redirect to the Google OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/login`;
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

            {(form.formState.errors.root || errorMessage) && (
              <div className="text-sm text-red-600 font-medium">
                {form.formState.errors.root?.message || errorMessage}
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

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mb-3 flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
            >
              <Chrome className="h-5 w-5" />
              Sign in with Google
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