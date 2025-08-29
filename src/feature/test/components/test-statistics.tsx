import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, Play } from "lucide-react";

interface TestStatisticsProps {
  isLoading: boolean;
  totalTests: number;
  activeTests: number;
  completedAttempts: number;
  userRole?: string;
}

export function TestStatistics({
  isLoading,
  totalTests,
  activeTests,
  completedAttempts,
  userRole,
}: TestStatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {userRole === "employee"
                  ? "Assigned Tests"
                  : "Total Evaluation"}
              </p>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : totalTests}
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Evaluations
              </p>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : activeTests}
              </p>
            </div>
            <Play className="h-8 w-8 text-accent" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed Assessments
              </p>
              <p className="text-2xl font-bold">{completedAttempts}</p>
            </div>
            <Calendar className="h-8 w-8 text-chart-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
