"use client";

import { useState } from "react";
import { X, Monitor, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemePreview } from "./ThemePreview";
import type {
  ThemeColors,
  ThemeTypography,
  ThemeLayout,
  ButtonStyle,
  HeaderConfig,
  Section,
  FooterConfig,
} from "@/lib/types/Theme";

interface ThemePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeId?: string;
  themeName?: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  layout: ThemeLayout;
  buttonStyle: ButtonStyle;
  header: HeaderConfig;
  sections: Section[];
  footer: FooterConfig;
}

export function ThemePreviewModal({
  isOpen,
  onClose,
  themeId,
  themeName = "Theme",
  colors,
  typography,
  layout,
  buttonStyle,
  header,
  sections,
  footer,
}: ThemePreviewModalProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-100 flex flex-col">
      {/* Modal Header - Fixed */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Full Preview - {themeName} Theme
          </h2>
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <Button
              variant={viewMode === "desktop" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("desktop")}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "tablet" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("tablet")}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "mobile" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("mobile")}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Modal Content - Scrollable */}
      <div className="flex-1 bg-gray-100 flex justify-center min-h-0">
        <div
          className="w-full h-full overflow-y-auto"
          style={{
            maxHeight: "calc(100vh - 80px)", // Account for header height
          }}
        >
          <div className="flex justify-center p-4">
            <ThemePreview
              themeId={themeId}
              colors={colors}
              typography={typography}
              layout={layout}
              buttonStyle={buttonStyle}
              header={header}
              sections={sections}
              footer={footer}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
