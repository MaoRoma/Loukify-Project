"use client";

import { useState } from "react";
import { ThemeCard } from "./ThemeCards";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/lib/context/ThemeContext";

const themes = [
  {
    id: "dawn",
    name: "Dawn",
    rating: 4.8,
    price: "Free",
    description: "A modern, minimalist theme perfect for any store",
    tags: ["Grid", "Fashion"],
    image: "/image/templete1.png",
  },
  {
    id: "sense",
    name: "Sence",
    rating: 4.7,
    price: "$180",
    isPremium: true,
    description: "Bold and beautiful theme with masonry layout",
    tags: ["Masonry", "Fashion"],
    image: "/image/templete2.png",
  },
  {
    id: "craft",
    name: "Craft",
    rating: 4.9,
    price: "$180",
    isPremium: true,
    description: "Showcase your products with elegant design",
    tags: ["Featured", "Handmade"],
    image: "/image/templete3.png",
  },
  {
    id: "studio",
    name: "Studio",
    rating: 4.8,
    price: "$180",
    isPremium: true,
    description: "Professional list-view theme",
    tags: ["List", "Electronics"],
    image: "/image/templete4.png",
  },
];

export function ThemeLibrary() {
  const [filter, setFilter] = useState<"all" | "free" | "premium">("all");
  const { currentThemeId } = useTheme();

  // Separate current theme from other themes
  const currentTheme = themes.find((theme) => theme.id === currentThemeId);
  const otherThemes = themes.filter((theme) => theme.id !== currentThemeId);

  const filteredThemes = otherThemes.filter((theme) => {
    if (filter === "free") return theme.price === "Free";
    if (filter === "premium") return theme.price !== "Free";
    return true;
  });

  const freeCount = themes.filter((t) => t.price === "Free").length;
  const premiumCount = themes.filter((t) => t.price !== "Free").length;
  const totalCount = themes.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Theme Library
          </h2>
          <p className="text-sm text-muted-foreground">
            Browse and install themes for your store
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredThemes.length} available
        </div>
      </div>

      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as "all" | "free" | "premium")}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">All Themes ({totalCount})</TabsTrigger>
          <TabsTrigger value="free">Free ({freeCount})</TabsTrigger>
          <TabsTrigger value="premium">Premium ({premiumCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredThemes.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} />
        ))}
      </div>
    </div>
  );
}
