import { TestQuestionView } from "@/feature/test-taking/test-question-view";

export const metadata = { title: `Test Questions` };

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <TestQuestionView />
    </div>
  );
}