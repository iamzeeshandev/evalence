import { TakeTestView } from "@/feature/test-taking/take-test-view";

export const metadata = { title: `Take Test` };

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <TakeTestView />
    </div>
  );
}
