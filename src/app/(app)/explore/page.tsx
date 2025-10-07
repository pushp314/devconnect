import { SnippetCard } from "@/components/snippet-card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockSnippets } from "@/lib/mock-data";
import { ChevronDown, Languages } from "lucide-react";

const languages = ["TypeScript", "JavaScript", "Python", "HTML", "CSS", "Go", "Rust", "Java", "C#"];

export default function ExplorePage() {
  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline">Explore Snippets</h1>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Languages className="mr-2 h-4 w-4" />
                Language
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map(lang => (
                <DropdownMenuItem key={lang}>{lang}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort By
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Newest</DropdownMenuItem>
              <DropdownMenuItem>Most Liked</DropdownMenuItem>
              <DropdownMenuItem>Most Commented</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockSnippets.map((snippet) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
      </div>
    </div>
  );
}
