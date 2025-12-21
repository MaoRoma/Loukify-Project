"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api/config";
import { HomePage } from "@/components/admin/online-store/customize/preview/HomePageStore";
import { Loader2 } from "lucide-react";
import { CartProvider } from "@/lib/context/CartContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { PreviewHeader } from "@/components/admin/online-store/customize/preview/PreviewHeader";
import { PreviewFooter } from "@/components/admin/online-store/customize/preview/PreviewFooter";
import { ProductDetailPage } from "@/components/admin/online-store/customize/preview/ProductDetailPage";
import { CartPage } from "@/components/admin/online-store/customize/preview/CartPage";
import { CheckoutPage } from "@/components/admin/online-store/customize/preview/CheckoutPageStore";
import type { HeaderConfig, FooterConfig } from "@/lib/types/Theme";

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
  payment_method_image?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: string;
  rating?: number;
  reviews?: number;
  image?: string;
}

export default function PublicStorePage() {
  const params = useParams();
  const subdomain = params?.subdomain as string;
  const [store, setStore] = useState<StoreTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState<"home" | "cart" | "checkout" | "product">("home");

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
          // Debug: Log payment method image
          console.log('[Store Page] Store loaded:', {
            subdomain,
            store_name: response.data.store_name,
            payment_method_image: response.data.payment_method_image,
            settings_id: response.data.settings_id,
            user_id: response.data.user_id
          });
        } else {
          setError("Store not found");
        }

        // Load public products for this store (if backend is configured)
        try {
          const productsResponse = await api.products.getPublicBySubdomain(subdomain);
          const apiProducts = productsResponse?.data || [];
          const mappedProducts: Product[] = apiProducts.map((p: any) => ({
            id: p.id,
            name: p.product_name || "Product",
            price: Number(p.product_price) || 0,
            description: p.product_description || "",
            category: p.product_category || "",
            stock: p.product_status === "active" ? "In Stock" : p.product_status,
            image: p.product_image || null,
          }));
          setProducts(mappedProducts);
        } catch (productError) {
          console.error("Failed to load public products:", productError);
          // Don't block store rendering if products fail
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

  const rawSections = store.section_part || [];
  const hasProducts = products.length > 0;
  // When real products exist, hide the demo \"featured-products\" section
  const sections = hasProducts
    ? rawSections.filter((section: any) => section.type !== "featured-products")
    : rawSections;
  const header = store.header_part || {};
  const footer = store.footer_part || {};

  // Safe defaults for header/footer to avoid missing fields
  const headerConfig: HeaderConfig = {
    logoText: header.logoText || store.store_name || "Store",
    layout: header.layout || "classic",
    showAnnouncement: header.showAnnouncement ?? false,
    announcementText: header.announcementText || "",
    navigationItems: header.navigationItems || ["Home", "Shop", "About", "Contact"],
    showSearchBar: header.showSearchBar ?? true,
    showWishlistIcon: header.showWishlistIcon ?? true,
  };

  const footerDefaults: FooterConfig = {
    columns: footer.columns || 3,
    backgroundColor: footer.backgroundColor || colors.background,
    columnSettings: footer.columnSettings || {
      column1: { title: "Company", links: [] },
      column2: { title: "Support", links: [] },
      column3: { title: "Legal", links: [] },
      column4: { title: "More", links: [] },
    },
    showNewsletter: footer.showNewsletter ?? false,
    newsletterTitle: footer.newsletterTitle || "",
    newsletterDescription: footer.newsletterDescription || "",
    showSocialIcons: footer.showSocialIcons ?? false,
    socialLinks: footer.socialLinks || {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    },
    contactInfo: footer.contactInfo || {
      email: "",
      phone: "",
      address: "",
    },
    showPaymentIcons: footer.showPaymentIcons ?? false,
    copyrightText:
      footer.copyrightText || "© 2024 Loukify. All rights reserved.",
  };

  // Navigation handlers
  const handleCartClick = () => {
    setCurrentView("cart");
    setSelectedProduct(null);
  };

  const handleCheckout = () => {
    setCurrentView("checkout");
  };

  const handleContinueShopping = () => {
    setCurrentView("home");
    setSelectedProduct(null);
  };

  const handleBackToCart = () => {
    setCurrentView("cart");
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView("product");
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setCurrentView("home");
  };

  // When viewing checkout page
  if (currentView === "checkout") {
    return (
      <CartProvider>
        <WishlistProvider>
          <div style={{ backgroundColor: colors.background, minHeight: "100vh" }}>
            <PreviewHeader
              colors={colors}
              typography={typography}
              header={headerConfig}
              onCartClick={handleCartClick}
              onWishlistClick={() => {}}
              onProductClick={handleProductClick}
            />
            <CheckoutPage
              colors={colors}
              typography={typography}
              buttonStyle={buttonStyle}
              paymentMethodImage={store?.payment_method_image}
              onBackToCart={handleBackToCart}
              onConfirmOrder={() => {
                // After order confirmation, go back to home
                setCurrentView("home");
                setSelectedProduct(null);
              }}
            />
            <PreviewFooter
              colors={colors}
              typography={typography}
              footer={footerDefaults}
              buttonStyle={buttonStyle}
              viewMode="desktop"
            />
          </div>
        </WishlistProvider>
      </CartProvider>
    );
  }

  // When viewing cart page
  if (currentView === "cart") {
    return (
      <CartProvider>
        <WishlistProvider>
          <div style={{ backgroundColor: colors.background, minHeight: "100vh" }}>
            <PreviewHeader
              colors={colors}
              typography={typography}
              header={headerConfig}
              onCartClick={handleCartClick}
              onWishlistClick={() => {}}
              onProductClick={handleProductClick}
            />
            <CartPage
              colors={colors}
              typography={typography}
              buttonStyle={buttonStyle}
              onContinueShopping={handleContinueShopping}
              onCheckout={handleCheckout}
            />
            <PreviewFooter
              colors={colors}
              typography={typography}
              footer={footerDefaults}
              buttonStyle={buttonStyle}
              viewMode="desktop"
            />
          </div>
        </WishlistProvider>
      </CartProvider>
    );
  }

  // When viewing a single product, show dedicated product detail page
  if (currentView === "product" && selectedProduct) {
    return (
      <CartProvider>
        <WishlistProvider>
          <div style={{ backgroundColor: colors.background, minHeight: "100vh" }}>
            <PreviewHeader
              colors={colors}
              typography={typography}
              header={headerConfig}
              onCartClick={handleCartClick}
              onWishlistClick={() => {}}
              onProductClick={handleProductClick}
            />
            <ProductDetailPage
              colors={colors}
              typography={typography}
              buttonStyle={buttonStyle}
              product={selectedProduct}
              onBack={handleBackToProducts}
              onAddToCart={handleCartClick}
            />
            <PreviewFooter
              colors={colors}
              typography={typography}
              footer={footerDefaults}
              buttonStyle={buttonStyle}
              viewMode="desktop"
            />
          </div>
        </WishlistProvider>
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <WishlistProvider>
        <div style={{ backgroundColor: colors.background, minHeight: "100vh" }}>
          <PreviewHeader
            colors={colors}
            typography={typography}
            header={headerConfig}
            onCartClick={handleCartClick}
            onWishlistClick={() => {}}
            onProductClick={handleProductClick}
          />
          <HomePage
            themeId={undefined}
            colors={colors}
            typography={typography}
            layout={layout}
            buttonStyle={buttonStyle}
            sections={sections}
            viewMode="desktop"
            onProductClick={handleProductClick}
          />
          {/* Dynamic products from your catalog */}
          {products.length > 0 && (
            <section className="px-6 py-16 max-w-6xl mx-auto">
              <h2
                className="text-2xl font-bold mb-6 text-center"
                style={{ color: colors.text, fontFamily: typography.headingFont }}
              >
                Our Products
              </h2>
              <div
                className="grid gap-6"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(
                    products.length,
                    layout.productsPerRow
                  )}, minmax(0, 1fr))`,
                }}
              >
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="bg-white border rounded-lg overflow-hidden flex flex-col text-left hover:shadow-md transition-shadow cursor-pointer"
                    style={{ borderColor: colors.secondary }}
                  >
                    <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-12 h-12 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      )}
                    </div>
                    <div className="p-4 space-y-1">
                      <h3
                        className="font-semibold truncate"
                        style={{
                          color: colors.text,
                          fontFamily: typography.bodyFont,
                          fontSize: `${typography.bodySize}px`,
                        }}
                      >
                        {product.name}
                      </h3>
                      <p
                        className="font-bold"
                        style={{
                          color: colors.primary,
                          fontSize: `${typography.bodySize}px`,
                        }}
                      >
                        ${product.price.toFixed(2)}
                      </p>
                      {product.category && (
                        <p
                          className="text-xs opacity-70"
                          style={{ color: colors.secondary }}
                        >
                          {product.category}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
          <PreviewFooter
            colors={colors}
            typography={typography}
            footer={footerDefaults}
            buttonStyle={buttonStyle}
            viewMode="desktop"
          />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

