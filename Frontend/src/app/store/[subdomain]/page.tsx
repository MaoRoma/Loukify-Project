"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api/config";
import { HomePage } from "@/components/admin/online-store/customize/preview/HomePageStore";
import { Loader2 } from "lucide-react";
import { CartProvider } from "@/lib/context/CartContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";

interface StoreTemplate {
  id: string;
  store_name: string;
  store_subdomain: string;
  theme_part: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  header_part: any;
  section_part: any[];
  footer_part: any;
  is_published: boolean;
}

export default function PublicStorePage() {
  const params = useParams();
  const subdomain = params?.subdomain as string;
  const [store, setStore] = useState<StoreTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      if (!subdomain) {
        setError("Invalid subdomain");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.storeTemplates.getBySubdomain(subdomain);
        
        if (response?.data) {
          setStore(response.data);
        } else {
          setError("Store not found");
        }
      } catch (err: any) {
        console.error("Failed to fetch store:", err);
        setError(err.message || "Store not found or not published");
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [subdomain]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
          <p className="text-muted-foreground">
            {error || "The store you're looking for doesn't exist or is not published."}
          </p>
        </div>
      </div>
    );
  }

  // Default theme values if not provided
  const themePart = store.theme_part || {};
  const colors = {
    primary: themePart.primary || "#3b82f6",
    secondary: themePart.secondary || "#8b5cf6",
    accent: themePart.accent || "#10b981",
    background: themePart.background || "#ffffff",
    text: themePart.text || "#1f2937",
  };

  const typography = {
    headingFont: "Inter",
    bodyFont: "Inter",
    headingSize: 32,
    bodySize: 16,
  };

  const layout = {
    productsPerRow: 4,
    spacing: 24,
    cardStyle: "minimal" as const,
  };

  const buttonStyle: "rounded" = "rounded";

  const sections = store.section_part || [];
  const header = store.header_part || {};
  const footer = store.footer_part || {};

  return (
    <CartProvider>
      <WishlistProvider>
        <div style={{ backgroundColor: colors.background, minHeight: "100vh" }}>
          <HomePage
            themeId={undefined}
            colors={colors}
            typography={typography}
            layout={layout}
            buttonStyle={buttonStyle}
            sections={sections}
            viewMode="desktop"
          />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

