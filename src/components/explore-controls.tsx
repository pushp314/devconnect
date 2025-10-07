"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Languages } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const languages = [
  "All", "TypeScript", "JavaScript", "Python", "HTML", "CSS", "Go", "Rust", "Java", "C#",
];
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "most-liked", label: "Most Liked" },
  { value: "most-commented", label: "Most Commented" },
];

export function ExploreControls() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentLang = searchParams.get("lang") || "All";
  const currentSort = searchParams.get("sortBy") || "newest";

  const handleFilterChange = (key: "lang" | "sortBy", value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Languages className="mr-2 h-4 w-4" />
            {currentLang}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang}
              onSelect={() => handleFilterChange("lang", lang)}
            >
              {lang}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {sortOptions.find(o => o.value === currentSort)?.label}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {sortOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onSelect={() => handleFilterChange("sortBy", opt.value)}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
