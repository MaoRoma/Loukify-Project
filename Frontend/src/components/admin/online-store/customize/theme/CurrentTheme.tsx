"use client";

import { Button } from "@/components/ui/button";
import { Eye, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/lib/context/ThemeContext";
import { useState } from "react";
import { ThemePreviewModal } from "./ThemePreviewModal";
import { getThemeById } from "@/lib/constants/themePresets";
import { useRouter } from "next/navigation";

// Theme metadata mapping
const themeMetadata = {
  dawn: {
    name: "Dawn",
    subtitle: "grid layout",
    description: "A modern, minimalist theme perfect for any store. Clean design with focus on products.",
    tags: ["Grid", "Fashion"],
    image: "/image/templete1.png",
    rating: 4.8,
    reviews: 1234,
    style: "Modern Style",
  },
  sense: {
    name: "Sence",
    subtitle: "masonry layout",
    description: "Bold and beautiful theme with masonry layout. Perfect for showcasing diverse product collections.",
    tags: ["Masonry", "Fashion"],
    image: "/image/templete2.png",
    rating: 4.7,
    reviews: 891,
    style: "Elegant Style",
  },
  craft: {
    name: "Craft",
    subtitle: "featured layout",
    description: "Showcase your products with elegant design. Ideal for handmade and artisan products.",
    tags: ["Featured", "Handmade"],
    image: "/image/templete3.png",
    rating: 4.9,
    reviews: 567,
    style: "Artisan Style",
  },
  studio: {
    name: "Studio",
    subtitle: "list layout",
    description: "Professional list-view theme. Perfect for electronics and technical products.",
    tags: ["List", "Electronics"],
    image: "/image/templete4.png",
    rating: 4.8,
    reviews: 432,
    style: "Professional Style",
  },
};

export function CurrentTheme() {
  const { currentThemeId } = useTheme();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const router = useRouter();
  
  const currentTheme = themeMetadata[currentThemeId as keyof typeof themeMetadata] || themeMetadata.dawn;
  const themePreset = getThemeById(currentThemeId);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Themes</h1>
        <p className="text-muted-foreground">
          Choose and customize the look and feel of your online store
        </p>
      </div>
      <div className="border-2 border-border rounded-2xl p-4 mb-8 bg-card">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Palette className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">Current Theme</h3>
                <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentTheme.name} - {currentTheme.subtitle}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-foreground text-background hover:bg-foreground/90"
              onClick={() => router.push(`/admin/online-store/customize?theme=${currentThemeId}`)}
            >
              <Palette className="w-4 h-4" />
              Customize
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden max-h-48">
            <Image
              src={currentTheme.image}
              alt={`${currentTheme.name} theme preview`}
              width={600}
              height={375}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-foreground mb-3">
              {currentTheme.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {currentTheme.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">{currentTheme.rating}</span>
                <span>({currentTheme.reviews} reviews)</span>
              </div>
              <span>•</span>
              <span>{currentTheme.style}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <ThemePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        themeId={currentThemeId}
        themeName={currentTheme.name}
        colors={themePreset.colors}
        typography={themePreset.typography}
        layout={themePreset.layout}
        buttonStyle={themePreset.buttonStyle}
        header={themePreset.header}
        sections={themePreset.sections}
        footer={themePreset.footer}
      />
    </>
  );
}
