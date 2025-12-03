"use client";

import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StoreNameInput() {
  return (
    <div className="space-y-2">
      <Label
        htmlFor="store-name"
        className="flex items-center gap-2 text-sm font-medium"
      >
        Add store name
        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
      </Label>
      <Input
        id="store-name"
        type="text"
        placeholder="Enter your store name"
        className="max-w-sm"
      />
    </div>
  );
}
