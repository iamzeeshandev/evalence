"use client";

import { TestCreationForm } from "@/feature/test/components/assessment-creation-form";
import { useGetTestByIdQuery } from "@/services/rtk-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const testId = params?.id as string;

  const { data: testData, isLoading } = useGetTestByIdQuery(testId, {
    skip: !testId,
  });
  return (
    <>
      {isLoading ? (
        <Loader2 />
      ) : (
        <div className="min-h-screen bg-background">
          <TestCreationForm
            testData={testData}
            testId={testId}
            isEditing={true}
          />
        </div>
      )}
    </>
  );
}
