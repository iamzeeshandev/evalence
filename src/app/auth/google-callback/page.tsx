"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasRun.current) return;
    hasRun.current = true;
    
    const authResponseParam = searchParams.get("auth_response");
    const error = searchParams.get("error");

    if (error) {
      // Handle error case
      console.error("Google authentication error:", error);
      router.push("/auth/sign-in?error=google_auth_failed");
      return;
    }

    if (authResponseParam) {
      try {
        // Parse the full auth response
        const authResponse = JSON.parse(decodeURIComponent(authResponseParam));
        
        // Set the auth data in the auth context
        login(authResponse);

        // Redirect to dashboard
        router.push("/");
      } catch (error) {
        console.error("Error parsing auth response:", error);
        router.push("/auth/sign-in?error=invalid_auth_response");
      }
    } else {
      // Handle missing auth response
      router.push("/auth/sign-in?error=invalid_callback");
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Processing Google Login...</h2>
        <p>Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}