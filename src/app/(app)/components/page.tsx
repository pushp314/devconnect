import { ComponentCard } from "@/components/component-card";
import { getComponents } from "@/app/actions/components";
import type { Component } from "@prisma/client";

export default async function ComponentsPage() {
  const components = (await getComponents({})) as Component[];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold font-headline mb-6">
        Component Marketplace
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {components.map((component) => (
          <ComponentCard
            key={component.id}
            component={{
              ...component,
              author: component.author!,
            }}
          />
        ))}
      </div>
    </div>
  );
}
