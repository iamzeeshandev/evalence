import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, PauseCircle, Play } from "lucide-react";

interface TestStatisticsProps {
  isLoading: boolean;
  totalTests: number;
  activeTests: number;
  userRole?: string;
}

export function TestStatistics({
  isLoading,
  totalTests,
  activeTests,
  userRole,
}: TestStatisticsProps) {
  const inactiveTests = Math.max(totalTests - activeTests, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {userRole === "employee"
                  ? "Assigned Assessments"
                  : "Total Assessments"}
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
                Active Assessments
              </p>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : activeTests}
              </p>
            </div>
            <Play className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Inactive Assessments
              </p>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : inactiveTests}
              </p>
            </div>
            <PauseCircle className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
