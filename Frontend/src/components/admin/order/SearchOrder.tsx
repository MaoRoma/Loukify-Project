"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, FilterX } from "lucide-react";

interface OrderSearchProps {
  onSearch: (query: string) => void;
  onFilter: () => void;
  isFiltered: boolean;
}

export function OrderSearch({ onSearch, onFilter, isFiltered }: OrderSearchProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search orders by ID, customer email, or status..."
          className="pl-10 bg-card"
          onChange={handleSearchChange}
        />
      </div>
      <Button 
        variant="outline" 
        className={`gap-2 ${isFiltered ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-transparent'}`}
        onClick={onFilter}
      >
        {isFiltered ? <FilterX className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
        {isFiltered ? 'Clear Filter' : 'Sort by Priority'}
      </Button>
    </div>
  );
}
