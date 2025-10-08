"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { Search, Code, BookOpen, User } from "lucide-react";
import { searchGlobal } from "@/app/actions/search";
import { useDebouncedCallback } from "use-debounce";
import type { User as UserType, Snippet, Document as DocType } from "@prisma/client";
import { useRouter } from "next/navigation";

type SearchResult = {
  users: UserType[];
  snippets: (Snippet & { author: UserType })[];
  docs: (DocType & { author: UserType })[];
};

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runSearch = useDebouncedCallback(async (term: string) => {
    if (!term) {
      setResults(null);
      return;
    }
    const searchResults = await searchGlobal(term);
    setResults(searchResults);
  }, 300);

  const handleSelect = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-4"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">Search...</span>
        <span className="sr-only">Search</span>
         <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 xl:flex">
          <span className="text-lg">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search for snippets, docs, or users..."
          value={query}
          onValueChange={(q) => {
            setQuery(q);
            runSearch(q);
          }}
        />
        <CommandList>
          {!results && <CommandEmpty>Type to search...</CommandEmpty>}
          {results && results.snippets.length === 0 && results.docs.length === 0 && results.users.length === 0 && (
             <CommandEmpty>No results found.</CommandEmpty>
          )}

          {results?.snippets.length > 0 && (
            <CommandGroup heading="Snippets">
              {results.snippets.map((snippet) => (
                <CommandItem key={snippet.id} onSelect={() => handleSelect(`/snippets/${snippet.id}`)} value={`snippet-${snippet.id}`}>
                  <Code className="mr-2" />
                  <span>{snippet.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results?.docs.length > 0 && (
            <CommandGroup heading="Documents">
              {results.docs.map((doc) => (
                <CommandItem key={doc.id} onSelect={() => handleSelect(`/docs/${doc.slug}`)} value={`doc-${doc.id}`}>
                  <BookOpen className="mr-2" />
                  <span>{doc.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results?.users.length > 0 && (
            <CommandGroup heading="Users">
              {results.users.map((user) => (
                <CommandItem key={user.id} onSelect={() => handleSelect(`/${user.username}`)} value={`user-${user.id}`}>
                  <User className="mr-2" />
                  <span>{user.name}</span>
                   <span className="text-muted-foreground ml-2">@{user.username}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
