import { TestViewPage } from "@/feature/test/view/test-view-page";

export const metadata = { title: `View Test` };

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <TestViewPage />
    </div>
  );
}