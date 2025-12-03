"use client";

import { useState } from "react";
import { CartProvider } from "@/lib/context/CartContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { PreviewHeader } from "../preview/PreviewHeader";
import { PreviewFooter } from "../preview/PreviewFooter";
import { HomePage } from "../preview/HomePageStore";
import { CartPage } from "../preview/CartPage";
import { ConfirmOrder } from "../preview/ConfirmOrder";
import { CheckoutPage } from "../preview/CheckoutPageStore";
import { ProductDetailPage } from "../preview/ProductDetailPage";
import { WishlistPage } from "../preview/WishlistPage";
import { getViewportWidth } from "@/lib/utils/ThemeHelper";
import type {
  ThemeColors,
  ThemeTypography,
  ThemeLayout,
  ButtonStyle,
  HeaderConfig,
  Section,
  FooterConfig,
  PageView,
} from "@/lib/types/Theme";

interface ThemePreviewProps {
  themeId?: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  layout: ThemeLayout;
  buttonStyle: ButtonStyle;
  header: HeaderConfig;
  sections: Section[];
  footer: FooterConfig;
  viewMode: "desktop" | "tablet" | "mobile";
}

export function ThemePreview({
  themeId,
  colors,
  typography,
  layout,
  buttonStyle,
  header,
  sections,
  footer,
  viewMode,
}: ThemePreviewProps) {
  const [currentPage, setCurrentPage] = useState<PageView>("home");
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
    price: number;
    description?: string;
    category?: string;
    stock?: string;
    rating?: number;
    reviews?: number;
  } | null>(null);

  return (
    <CartProvider>
      <WishlistProvider>
        <div
          className="bg-white shadow-2xl transition-all duration-300 relative"
          style={{
            width: getViewportWidth(viewMode),
            maxWidth: "100%",
            backgroundColor: colors.background,
            color: colors.text,
            minHeight: "100vh", // Ensure minimum height
          }}
        >
          <PreviewHeader
            colors={colors}
            typography={typography}
            header={header}
            onCartClick={() => setCurrentPage("cart")}
            onWishlistClick={() => setCurrentPage("wishlist")}
            onProductClick={(product) => {
              setSelectedProduct(product);
              setCurrentPage("productDetail");
            }}
          />

        <div className="min-h-[50vh]">
          {currentPage === "home" && (
            <HomePage
              themeId={themeId}
              colors={colors}
              typography={typography}
              layout={layout}
              buttonStyle={buttonStyle}
              sections={sections}
              viewMode={viewMode}
              onProductClick={(product) => {
                setSelectedProduct(product);
                setCurrentPage("productDetail");
              }}
            />
          )}

          {currentPage === "productDetail" && selectedProduct && (
            <ProductDetailPage
              colors={colors}
              typography={typography}
              buttonStyle={buttonStyle}
              product={selectedProduct}
              onBack={() => setCurrentPage("home")}
            />
          )}

          {currentPage === "cart" && (
            <CartPage
              colors={colors}
              typography={typography}
              buttonStyle={buttonStyle}
              onContinueShopping={() => setCurrentPage("home")}
              onCheckout={() => setCurrentPage("checkout")}
            />
          )}

          {currentPage === "checkout" && (
            <CheckoutPage
              colors={colors}
              typography={typography}
              buttonStyle={buttonStyle}
              onBackToCart={() => setCurrentPage("cart")}
              onConfirmOrder={() => setCurrentPage("confirmOrder")}
            />
          )}

          {currentPage === "wishlist" && (
            <WishlistPage
              colors={colors}
              typography={typography}
              buttonStyle={buttonStyle}
              onBack={() => setCurrentPage("home")}
              onProductClick={(product) => {
                setSelectedProduct(product);
                setCurrentPage("productDetail");
              }}
            />
          )}

          {currentPage === "confirmOrder" && (
            <ConfirmOrder
              colors={colors}
              typography={typography}
              buttonStyle={buttonStyle}
              onContinueShopping={() => setCurrentPage("home")}
            />
          )}
        </div>

        <PreviewFooter
          colors={colors}
          typography={typography}
          footer={footer}
          buttonStyle={buttonStyle}
          viewMode={viewMode}
        />
      </div>
      </WishlistProvider>
    </CartProvider>
  );
}
