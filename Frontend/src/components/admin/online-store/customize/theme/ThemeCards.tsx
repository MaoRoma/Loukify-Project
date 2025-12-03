"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Download, Palette } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ThemePreviewModal } from "./ThemePreviewModal";
import { getThemeById } from "@/lib/constants/themePresets";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/context/ThemeContext";

interface ThemeCardProps {
  theme: {
    id: string;
    name: string;
    rating: number;
    price: string;
    isCurrent?: boolean;
    isPremium?: boolean;
    description: string;
    tags: string[];
    image: string;
  };
}

export function ThemeCard({ theme }: ThemeCardProps) {
  const isFree = theme.price === "Free";
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const router = useRouter();
  const themePreset = getThemeById(theme.id);
  const { setCurrentTheme } = useTheme();

  const handleAddTheme = () => {
    // Set this theme as current (stay on the same page)
    setCurrentTheme(theme.id);
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-shadow">
      <div className="relative aspect-4/3 bg-muted">
        {(theme.isCurrent || theme.isPremium) && (
          <div className="absolute top-3 right-3 z-10">
            {theme.isCurrent && (
              <Badge className="bg-green-500 text-white hover:bg-green-600 border-0">
                Current
              </Badge>
            )}
            {theme.isPremium && !theme.isCurrent && (
              <Badge className="bg-orange-500 text-white hover:bg-orange-600 border-0">
                Premium
              </Badge>
            )}
          </div>
        )}
        <Image
          src={theme.image || "/placeholder.svg"}
          alt={theme.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground">{theme.name}</h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{theme.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-foreground">
            {theme.price}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {theme.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {theme.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 bg-transparent"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>

          {theme.isCurrent ? (
            <Button
              size="sm"
              className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90"
              onClick={() => router.push(`/admin/online-store/customize?theme=${theme.id}`)}
            >
              <Palette className="w-4 h-4" />
              Customize
            </Button>
          ) : isFree ? (
            <Button
              size="sm"
              className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90"
              onClick={handleAddTheme}
            >
              <Download className="w-4 h-4" />
              Add Theme
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90"
              onClick={handleAddTheme}
            >
              <Download className="w-4 h-4" />
              Add Theme
            </Button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <ThemePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        themeId={theme.id}
        themeName={theme.name}
        colors={themePreset.colors}
        typography={themePreset.typography}
        layout={themePreset.layout}
        buttonStyle={themePreset.buttonStyle}
        header={themePreset.header}
        sections={themePreset.sections}
        footer={themePreset.footer}
      />
    </div>
  );
}
