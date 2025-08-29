import { TestAssignments } from "@/feature/test-assignments/view/test-assignments";

export const metadata = { title: `Test Assignments` };

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <TestAssignments />
    </div>
  );
}
