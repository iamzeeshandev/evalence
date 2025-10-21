import { UserTestsView } from "@/feature/user-tests/user-tests-view";

export const metadata = { title: `My Tests` };

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <UserTestsView />
    </div>
  );
}

