import { TestAttemptView } from "@/feature/test-taking/test-attempt-view";

export const metadata = { title: `Test Attempt` };

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <TestAttemptView />
    </div>
  );
}
