"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface CustomerSearchProps {
  onSearch: (query: string) => void;
}

export function CustomerSearch({ onSearch }: CustomerSearchProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search customers by name, email, or location..."
          className="pl-10 bg-card"
          onChange={handleSearchChange}
        />
      </div>
      <Button variant="outline" className="gap-2 bg-transparent">
        <Filter className="w-4 h-4" />
        Filter
      </Button>
    </div>
  );
}
