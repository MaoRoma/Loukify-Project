"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  RotateCcw,
  Palette,
  Type,
  LayoutGrid,
  Menu,
  Loader2,
} from "lucide-react";
import { ThemePreview } from "../theme/ThemePreview";
import { ThemePreviewModal } from "../theme/ThemePreviewModal";
import { Header } from "@/components/admin/dashboard/Header";
import { useRouter, useSearchParams } from "next/navigation";
// Add these type imports
import type {
  ThemeColors,
  ThemeTypography,
  ThemeLayout,
  ButtonStyle,
  HeaderConfig,
  Section,
  FooterConfig,
} from "@/lib/types/Theme";
import { ThemeTab } from "../tabs/ThemeTab";
import { HeaderTab } from "../tabs/HeaderTab";
import { SectionsTab } from "../tabs/SectionsTab";
import { FooterTab } from "../tabs/FooterTab";
import { getThemeById, dawnTheme } from "@/lib/constants/themePresets";
import { useTheme } from "@/lib/context/ThemeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/config";

export function ThemeCustomizer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentThemeId } = useTheme();
  
  // Use URL theme parameter, fallback to current theme from context
  const themeId = searchParams.get("theme") || currentThemeId;
  
  const [activeTab, setActiveTab] = useState("theme");
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Load initial theme preset
  const initialTheme = getThemeById(themeId);
  
  // Add type annotations to your state
  const [colors, setColors] = useState<ThemeColors>(initialTheme.colors);
  const [typography, setTypography] = useState<ThemeTypography>(initialTheme.typography);
  const [layout, setLayout] = useState<ThemeLayout>(initialTheme.layout);
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>(initialTheme.buttonStyle);
  const [header, setHeader] = useState<HeaderConfig>(initialTheme.header);
  const [sections, setSections] = useState<Section[]>(initialTheme.sections);
  const [footer, setFooter] = useState<FooterConfig>(initialTheme.footer);
  const [currentThemeName, setCurrentThemeName] = useState(initialTheme.name);
  const [storeName, setStoreName] = useState("");
  const [storeSubdomain, setStoreSubdomain] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const slugify = (value: string) =>
    value
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "";

  // Update theme when themeId changes
  useEffect(() => {
    const theme = getThemeById(themeId);
    setColors(theme.colors);
    setTypography(theme.typography);
    setLayout(theme.layout);
    setButtonStyle(theme.buttonStyle);
    setHeader(theme.header);
    setSections(theme.sections);
    setFooter(theme.footer);
    setCurrentThemeName(theme.name);
  }, [themeId]);

  // Load existing store template data (if any)
  useEffect(() => {
    const fetchStoreTemplate = async () => {
      try {
        const response = await api.storeTemplates.get();
        if (response?.data) {
          setStoreName(response.data.store_name || "");
          setStoreSubdomain(response.data.store_subdomain || "");
        }
      } catch (error) {
        console.error("Failed to load store template:", error);
      }
    };

    fetchStoreTemplate();
  }, []);

  const tabs = [
    { id: "theme", label: "Theme", icon: Palette },
    { id: "header", label: "Header", icon: Type },
    { id: "sections", label: "Sections", icon: LayoutGrid },
    { id: "footer", label: "Footer", icon: Menu },
  ];

  const isValidUuid = (value?: string | null) =>
    !!value && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(value);

  const buildSubdomain = () => {
    if (storeSubdomain) return slugify(storeSubdomain);
    if (storeName) return slugify(storeName);
    return slugify(currentThemeName) || `store-${Math.random().toString(36).slice(2, 7)}`;
  };

  // Save only (store draft/customization) – do not publish
  const handleSave = async () => {
    const domain = buildSubdomain();

    try {
      setIsSaving(true);
      setSaveMessage(null);
      setPublishError(null);

      await api.storeTemplates.save({
        ...(isValidUuid(themeId) && { base_template_id: themeId }),
        theme_part: {
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
          background: colors.background,
          text: colors.text,
        },
        header_part: header,
        section_part: sections,
        footer_part: footer,
        store_name: storeName || currentThemeName,
        store_subdomain: domain,
      });

      setSaveMessage("Template saved successfully.");
    } catch (error: any) {
      console.error("Failed to save store template:", error);
      setPublishError(error.message || "Failed to save template.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    const domain = buildSubdomain();

    if (!storeName && !storeSubdomain) {
      setPublishError("Please enter your store name or custom subdomain.");
      return;
    }

    try {
      setIsPublishing(true);
      setPublishError(null);

      await api.storeTemplates.save({
        ...(isValidUuid(themeId) && { base_template_id: themeId }),
        theme_part: {
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
          background: colors.background,
          text: colors.text,
        },
        header_part: header,
        section_part: sections,
        footer_part: footer,
        store_name: storeName || currentThemeName,
        store_subdomain: domain,
      });

      const publishResponse = await api.storeTemplates.publish({ store_subdomain: domain });
      const storeUrl = publishResponse?.store_url
        ? `https://${publishResponse.store_url}`
        : `https://${domain}.loukify.com`;

      alert(publishResponse?.message || `Store published at ${storeUrl}`);
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Failed to publish store:", error);
      setPublishError(error.message || "Failed to publish store. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleReset = () => {
    const theme = getThemeById(themeId);
    setColors(theme.colors);
    setTypography(theme.typography);
    setLayout(theme.layout);
    setButtonStyle(theme.buttonStyle);
    setHeader(theme.header);
    setSections(theme.sections);
    setFooter(theme.footer);
  };

  return (
    <>
      {/* Header */}
      <Header />

      <div className="fixed inset-0 top-14 bg-background z-40 flex">
        {/* Left Sidebar - Customization Panel */}
        <div className="w-[280px] border-r border-border bg-card flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => router.back()}
                >
                  <X className="h-4 w-4" />
                </Button>
                <h2 className="font-semibold text-foreground">
                  Customize {currentThemeName}
                </h2>
              </div>
            </div>
            <p className="text-xs text-muted-foreground ml-10">
              {layout.productsPerRow === 3 ? "masonry" : "grid"} layout • Click elements to edit
            </p>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name" className="text-xs font-medium">
                  Store name
                </Label>
                <Input
                  id="store-name"
                  placeholder="e.g., Luxe Boutique"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-domain" className="text-xs font-medium">
                  Store subdomain
                </Label>
                <div className="relative">
                  <Input
                    id="store-domain"
                    placeholder="yourstore"
                    value={storeSubdomain}
                    onChange={(e) => setStoreSubdomain(slugify(e.target.value))}
                    className="pr-28"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    .loukify.com
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This will be the link that customers use to visit your store.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 p-3 border-b border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={`justify-start gap-2 ${
                    activeTab === tab.id
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Customization Controls */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {activeTab === "theme" && (
              <ThemeTab
                colors={colors}
                setColors={setColors}
                typography={typography}
                setTypography={setTypography}
                layout={layout}
                setLayout={setLayout}
                buttonStyle={buttonStyle}
                setButtonStyle={setButtonStyle}
                themeId={themeId}
              />
            )}

            {activeTab === "header" && (
              <HeaderTab header={header} setHeader={setHeader} />
            )}

            {activeTab === "sections" && (
              <SectionsTab sections={sections} setSections={setSections} />
            )}

            {activeTab === "footer" && (
              <FooterTab footer={footer} setFooter={setFooter} />
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleSave}
                disabled={isSaving || isPublishing}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Draft"
                )}
              </Button>
              <Button
                className="flex-1 bg-foreground text-background hover:bg-foreground/90"
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Public"
                )}
              </Button>
            </div>
            {saveMessage && (
              <p className="text-xs text-emerald-600">{saveMessage}</p>
            )}
            {publishError && (
              <p className="text-xs text-destructive">{publishError}</p>
            )}
          </div>
        </div>

        {/* Right Side - Preview Area */}
        <div className="flex-1 flex flex-col bg-muted/30">
          {/* Preview Header */}
          <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
            <div className="text-sm font-medium text-foreground">
              Live Preview
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2 bg-transparent"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "desktop" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("desktop")}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "tablet" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("tablet")}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "mobile" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("mobile")}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewModalOpen(true)}
                className="gap-2 bg-transparent"
              >
                <Maximize2 className="w-4 h-4" />
                Full Preview
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
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

      {/* Full Preview Modal */}
      <ThemePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        themeId={themeId}
        themeName={currentThemeName}
        colors={colors}
        typography={typography}
        layout={layout}
        buttonStyle={buttonStyle}
        header={header}
        sections={sections}
        footer={footer}
      />
    </>
  );
}
