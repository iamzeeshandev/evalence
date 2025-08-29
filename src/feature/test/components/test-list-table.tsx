import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TestResponse } from "@/services/rtk-query/tests/tests-type";
import { Clock, Edit } from "lucide-react";

interface TestListTableProps {
  tests: TestResponse[];
  userRole?: string;
  onEdit: (test: TestResponse) => void;
  onStartTest: (test: TestResponse) => void;
  canCreateTests: boolean;
  formatDate: (dateString: string) => string;
}

export function TestListTable({
  tests,
  userRole,
  onEdit,
  onStartTest,
  canCreateTests,
  formatDate,
}: TestListTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4 font-medium">Assessment Name</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Duration</th>
                <th className="p-4 font-medium">Questions</th>
                <th className="p-4 font-medium">Companies</th>
                <th className="p-4 font-medium">Attempts</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => {
                const isExpired =
                  userRole === "employee" &&
                  new Date("2025-12-31") < new Date();
                const hasNoQuestions = (test.questions?.length || 0) === 0;

                return (
                  <tr key={test.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{test.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {test.description}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={test.isActive ? "default" : "secondary"}>
                        {test.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        {test.duration} min
                      </div>
                    </td>
                    <td className="p-4">{test.questions?.length || 0}</td>
                    <td className="p-4">10</td>
                    <td className="p-4">10</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStartTest(test)}
                          disabled={
                            !test.isActive || hasNoQuestions || isExpired
                          }
                        >
                          {hasNoQuestions
                            ? "No Questions"
                            : isExpired
                            ? "Expired"
                            : "Take Assessment"}
                        </Button>
                        {canCreateTests && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(test)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
