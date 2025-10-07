import { getBugs, reportBug } from "@/app/actions/bugs";
import { BugReportCard } from "@/components/bug-report-card";
import { SubmitBugForm } from "@/components/forms/submit-bug-form";

export default async function BugsPage() {
  const bugs = await getBugs({});

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Bug Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-6">
          {bugs.map((bug) => (
            <BugReportCard key={bug.id} bug={bug} />
          ))}
        </div>

        <aside className="sticky top-20 h-fit">
          <SubmitBugForm />
        </aside>
      </div>
    </div>
  );
}
