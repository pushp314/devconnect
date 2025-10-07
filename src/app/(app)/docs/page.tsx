import { DocCard } from "@/components/doc-card";
import { mockDocs } from "@/lib/mock-data";

export default function DocsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Documentation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDocs.map((doc) => (
          <DocCard key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
}
