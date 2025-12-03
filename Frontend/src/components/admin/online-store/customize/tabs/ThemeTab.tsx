"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_FONTS, loadGoogleFont } from "@/lib/constants/fonts";

interface ThemeTabProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  setColors: (colors: any) => void;
  typography: {
    headingFont: string;
    bodyFont: string;
    headingSize: number;
    bodySize: number;
  };
  setTypography: (typography: any) => void;
  layout: {
    productsPerRow: number;
    spacing: number;
    cardStyle: "minimal" | "ordered"; // Add this line
  };
  setLayout: (layout: any) => void;
  buttonStyle: "square" | "rounded" | "pill";
  setButtonStyle: (style: "square" | "rounded" | "pill") => void;
  themeId?: string;
}

export function ThemeTab({
  colors,
  setColors,
  typography,
  setTypography,
  layout,
  setLayout,
  buttonStyle,
  setButtonStyle,
  themeId,
}: ThemeTabProps) {
  // Check if current theme should hide layout controls
  const shouldHideLayoutControls = themeId && ['sense', 'craft', 'studio'].includes(themeId);
  const handleFontChange = (
    fontType: "headingFont" | "bodyFont",
    fontValue: string
  ) => {
    // Load the Google Font
    loadGoogleFont(fontValue);

    // Update typography state
    setTypography({
      ...typography,
      [fontType]: fontValue,
    });
  };

  return (
    <>
      {/* Colors */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Colors</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">
              Primary Color
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={colors.primary}
                onChange={(e) =>
                  setColors({ ...colors, primary: e.target.value })
                }
                className="w-10 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={colors.primary}
                onChange={(e) =>
                  setColors({ ...colors, primary: e.target.value })
                }
                className="flex-1 text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">
              Secondary Color
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={colors.secondary}
                onChange={(e) =>
                  setColors({ ...colors, secondary: e.target.value })
                }
                className="w-10 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={colors.secondary}
                onChange={(e) =>
                  setColors({ ...colors, secondary: e.target.value })
                }
                className="flex-1 text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">
              Accent Color
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={colors.accent}
                onChange={(e) =>
                  setColors({ ...colors, accent: e.target.value })
                }
                className="w-10 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={colors.accent}
                onChange={(e) =>
                  setColors({ ...colors, accent: e.target.value })
                }
                className="flex-1 text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">
              Background Color
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={colors.background}
                onChange={(e) =>
                  setColors({ ...colors, background: e.target.value })
                }
                className="w-10 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={colors.background}
                onChange={(e) =>
                  setColors({ ...colors, background: e.target.value })
                }
                className="flex-1 text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Text Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={colors.text}
                onChange={(e) => setColors({ ...colors, text: e.target.value })}
                className="w-10 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={colors.text}
                onChange={(e) => setColors({ ...colors, text: e.target.value })}
                className="flex-1 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Typography</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">
              Heading Font
            </Label>
            <Select
              value={typography.headingFont}
              onValueChange={(value) => handleFontChange("headingFont", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select heading font" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_FONTS.map((font) => (
                  <SelectItem
                    key={font.value}
                    value={font.value}
                    style={{ fontFamily: `'${font.value}', sans-serif` }}
                  >
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Body Font</Label>
            <Select
              value={typography.bodyFont}
              onValueChange={(value) => handleFontChange("bodyFont", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select body font" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_FONTS.map((font) => (
                  <SelectItem
                    key={font.value}
                    value={font.value}
                    style={{ fontFamily: `'${font.value}', sans-serif` }}
                  >
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">
                Heading Size: {typography.headingSize}px
              </Label>
            </div>
            <Slider
              value={[typography.headingSize]}
              onValueChange={([value]) =>
                setTypography({ ...typography, headingSize: value })
              }
              min={24}
              max={60}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">
                Body Text Size: {typography.bodySize}px
              </Label>
            </div>
            <Slider
              value={[typography.bodySize]}
              onValueChange={([value]) =>
                setTypography({ ...typography, bodySize: value })
              }
              min={12}
              max={24}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Layout Style - Only show for Dawn theme */}
      {!shouldHideLayoutControls && (
        <div>
          <h3 className="font-semibold text-sm mb-3">Layout Style</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-muted-foreground">
                  Products Per Row: {layout.productsPerRow}
                </Label>
              </div>
              <Slider
                value={[layout.productsPerRow]}
                onValueChange={([value]) =>
                  setLayout({ ...layout, productsPerRow: value })
                }
                min={2}
                max={6}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Card Style
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {/* Minimal Style */}
                <button
                  onClick={() => setLayout({ ...layout, cardStyle: "minimal" })}
                  className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    layout.cardStyle === "minimal"
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/50"
                  }`}
                >
                  <div className="w-full space-y-2">
                    {/* Product image placeholder */}
                    <div className="w-full h-12 bg-gray-200 rounded flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                      </svg>
                    </div>
                    {/* Product info */}
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-400 rounded mt-2"></div>
                    </div>
                  </div>
                  <span className="text-xs">Minimal</span>
                </button>

                {/* Ordered/List Style */}
                <button
                  onClick={() => setLayout({ ...layout, cardStyle: "ordered" })}
                  className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    layout.cardStyle === "ordered"
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/50"
                  }`}
                >
                  <div className="w-full space-y-2">
                    {/* Horizontal layout */}
                    <div className="flex gap-2 p-2 border border-gray-200 rounded">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center shrink-0">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                        <div className="h-1.5 bg-gray-300 rounded w-2/3"></div>
                      </div>
                      <div className="w-6 h-4 bg-gray-400 rounded"></div>
                    </div>
                    {/* Repeat for second item */}
                    <div className="flex gap-2 p-2 border border-gray-200 rounded">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center shrink-0">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                        <div className="h-1.5 bg-gray-300 rounded w-2/3"></div>
                      </div>
                      <div className="w-6 h-4 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                  <span className="text-xs">Ordered</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-muted-foreground">
                  Spacing: {layout.spacing}px
                </Label>
              </div>
              <Slider
                value={[layout.spacing]}
                onValueChange={([value]) =>
                  setLayout({ ...layout, spacing: value })
                }
                min={8}
                max={48}
                step={4}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Buttons</h3>
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">
            Style
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setButtonStyle("square")}
              className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                buttonStyle === "square"
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/50"
              }`}
            >
              <div className="w-full h-8 bg-foreground rounded-none" />
              <span className="text-xs">Square</span>
            </button>
            <button
              onClick={() => setButtonStyle("rounded")}
              className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                buttonStyle === "rounded"
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/50"
              }`}
            >
              <div className="w-full h-8 bg-foreground rounded-md" />
              <span className="text-xs">Rounded</span>
            </button>
            <button
              onClick={() => setButtonStyle("pill")}
              className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                buttonStyle === "pill"
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/50"
              }`}
            >
              <div className="w-full h-8 bg-foreground rounded-full" />
              <span className="text-xs">Pill</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
