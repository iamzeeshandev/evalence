import { TestCreationForm } from "@/feature/test/components/assessment-creation-form";

export const metadata = { title: `Test Form` };

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <TestCreationForm />
    </div>
  );
}
