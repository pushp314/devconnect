import { ComponentCard } from "@/components/component-card";
import { mockComponents } from "@/lib/mock-data";

export default function ComponentsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Component Marketplace</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {mockComponents.map((component) => (
          <ComponentCard key={component.id} component={component} />
        ))}
        {mockComponents.map((component) => (
          <ComponentCard key={`${component.id}-2`} component={component} />
        ))}
      </div>
    </div>
  );
}
