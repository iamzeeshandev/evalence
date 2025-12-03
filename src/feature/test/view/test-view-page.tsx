"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetTestByIdQuery } from "@/services/rtk-query/tests/tests-apis";
import { Clock, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { ReadonlyQuestionsListView } from "../components/readonly-questions-list-view";

export function TestViewPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.id as string;

  const { data: test, isLoading, isError } = useGetTestByIdQuery(testId, {
    skip: !testId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (isError || !test) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <p className="text-lg font-medium">Test not found</p>
          <p className="text-sm">The requested test could not be loaded.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{test.title}</h1>
          <p className="text-muted-foreground">Test Details and Questions</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tests
        </Button>
      </div>

      {/* Test Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center p-2 rounded-full bg-blue-100">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={test.isActive ? "default" : "secondary"} className="mt-1">
                  {test.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center p-2 rounded-full bg-green-100">
                <Clock className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{test.duration} minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center p-2 rounded-full bg-purple-100">
                <div className="w-4 h-4 text-purple-500 flex items-center justify-center">Q</div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="font-medium">{test.questions?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center p-2 rounded-full bg-amber-100">
                <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">
                  {new Date(test.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Description Card */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{test.description || "No description provided."}</p>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>
            All questions in this test with correct answers highlighted
          </CardDescription>
        </CardHeader>
        <CardContent>
          {test.questions && test.questions.length > 0 ? (
            <ReadonlyQuestionsListView
              questions={test.questions}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p className="text-lg font-medium">No questions available</p>
              <p className="text-sm">This test does not have any questions yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}