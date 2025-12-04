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
import { TestResponse } from "@/services/rtk-query/tests/tests-type";
import {
  Activity,
  ArrowLeft,
  BookOpenCheck,
  CalendarClock,
  Clock3,
  Layers3,
  ListChecks,
  RefreshCcw,
} from "lucide-react";
import { ReactNode } from "react";
import { useRouter, useParams } from "next/navigation";
import { ReadonlyQuestionsListView } from "../components/readonly-questions-list-view";

type ExtendedTestResponse = TestResponse & {
  testCategory?: string;
  likertScale?: Array<{ label: string; value: number }>;
  likertMin?: number;
  likertMax?: number;
  psychometricConfig?: {
    scoringStandard?: string;
    defaultOptions?: Array<{ text: string; score: number }>;
  };
};

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

  const extendedTest = test as ExtendedTestResponse;

  const formatLabel = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "number") return value.toString();
    return value
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return value;
    }
  };

  const isPsychometric =
    extendedTest.testCategory === "PSYCHOMETRIC" ||
    extendedTest.type?.toLowerCase() === "psychometric";

  const likertScale = extendedTest.likertScale ?? [];

  const infoRows: Array<{
    label: string;
    icon: ReactNode;
    helper?: string;
    value?: string;
    node?: ReactNode;
  }> = [
    {
      label: "Status",
      icon: <Activity className="h-4 w-4 text-blue-500" />,
      helper: extendedTest.isActive
        ? "Participants can access this assessment"
        : "Hidden from participants",
      node: (
        <Badge variant={extendedTest.isActive ? "default" : "secondary"}>
          {extendedTest.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      label: "Assessment Type",
      icon: <BookOpenCheck className="h-4 w-4 text-purple-500" />,
      helper: "Question structure & evaluation style",
      value: formatLabel(extendedTest.testCategory ?? extendedTest.type),
    },
    {
      label: "Duration",
      icon: <Clock3 className="h-4 w-4 text-emerald-500" />,
      helper: "Recommended completion window",
      value: `${extendedTest.duration} minutes`,
    },
    {
      label: "Questions",
      icon: <ListChecks className="h-4 w-4 text-indigo-500" />,
      helper: "Total configured questions",
      value: `${extendedTest.questions?.length ?? 0}`,
    },
    {
      label: "Created On",
      icon: <CalendarClock className="h-4 w-4 text-gray-500" />,
      helper: "Initial publish date",
      value: formatDate(extendedTest.createdAt),
    },
    {
      label: "Last Updated",
      icon: <RefreshCcw className="h-4 w-4 text-gray-500" />,
      helper: "Most recent configuration change",
      value: formatDate(extendedTest.updatedAt),
    },
  ];

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

      {/* Test Information */}
      <Card className="shadow-sm border border-border/80">
        <CardHeader>
          <CardTitle>Test Information</CardTitle>
          <CardDescription>
            Comprehensive overview tailored for every assessment category
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-2xl border bg-card/60">
            {infoRows.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-3 border-b px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-muted p-2">{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>
                    {item.helper && (
                      <p className="text-xs text-muted-foreground">
                        {item.helper}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-base font-semibold text-foreground">
                  {item.node ?? item.value ?? "—"}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-muted/30 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              {extendedTest.description?.trim() || "No description provided."}
            </p>
          </div>

          {isPsychometric && (
            <div className="rounded-xl border bg-purple-50/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                Psychometric Configuration
              </p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Scoring Standard</p>
                  <p className="text-base font-semibold text-foreground">
                    {extendedTest.psychometricConfig?.scoringStandard ||
                      (extendedTest.likertMin !== undefined &&
                      extendedTest.likertMax !== undefined
                        ? `${extendedTest.likertMin} - ${extendedTest.likertMax} scale`
                        : "Likert scale")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Response Options</p>
                  <p className="text-base font-semibold text-foreground">
                    {likertScale.length
                      ? `${likertScale.length} choices`
                      : "Not configured"}
                  </p>
                </div>
              </div>
              {likertScale.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {likertScale.map((item, index) => (
                    <Badge key={`${item.value}-${index}`} variant="outline">
                      {item.value}: {item.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
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