import { TestDashboard } from "@/feature/test/view/test-dashboard-view";

export const metadata = { title: `Test` };

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <TestDashboard />
    </div>
  );
}
