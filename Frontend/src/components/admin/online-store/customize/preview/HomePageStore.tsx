"use client";

import type {
  ThemeColors,
  ThemeTypography,
  ThemeLayout,
  ButtonStyle,
  Section,
} from "@/lib/types/Theme";
import { getButtonRadius } from "@/lib/utils/ThemeHelper";
import { useCart } from "@/lib/context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: string;
  rating?: number;
  reviews?: number;
}

interface HomePageProps {
  themeId?: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  layout: ThemeLayout;
  buttonStyle: ButtonStyle;
  sections: Section[];
  viewMode: "desktop" | "tablet" | "mobile";
  onProductClick?: (product: Product) => void;
}

export function HomePage({
  themeId,
  colors,
  typography,
  layout,
  buttonStyle,
  sections,
  viewMode,
  onProductClick,
}: HomePageProps) {
  const { addToCart } = useCart();
  const gridCols = layout.productsPerRow;

  const handleScrollToShop = () => {
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const renderSection = (section: Section) => {
    if (!section.enabled) return null;

    switch (section.type) {
      case "hero":
        return (
          <div key={section.id} id="home" className="px-6 py-16 text-center">
            <h1
              className="font-bold mb-4"
              style={{
                fontSize: `${typography.headingSize}px`,
                color: colors.text,
              }}
            >
              {section.content.heading || "Welcome to Our Store"}
            </h1>
            <p
              className="mb-6"
              style={{
                fontSize: `${typography.bodySize}px`,
                color: colors.secondary,
              }}
            >
              {section.content.subheading ||
                "Discover amazing products at great prices"}
            </p>
            <button
              onClick={handleScrollToShop}
              className="px-8 py-3 font-medium transition-opacity hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: colors.secondary,
                color: "#ffffff",
                borderRadius: getButtonRadius(buttonStyle),
                fontSize: `${typography.bodySize}px`,
              }}
            >
              {section.content.buttonText || "Shop Now"}
            </button>
          </div>
        );

      case "featured-products":
        return (
          <div key={section.id} id="shop" className="px-6 py-12">
            <h2
              className="text-center font-bold mb-8"
              style={{
                fontSize: `${typography.headingSize * 0.7}px`,
                color: colors.text,
              }}
            >
              {section.content.heading || "Featured Collection"}
            </h2>
            {section.content.description && (
              <p
                className="text-center mb-8"
                style={{
                  fontSize: `${typography.bodySize}px`,
                  color: colors.secondary,
                }}
              >
                {section.content.description}
              </p>
            )}
            
            {/* Featured Layout for Craft theme ONLY */}
            {themeId === "craft" ? (
              <div className="bg-slate-50 py-20">
                {/* Main Title */}
                <h2 
                  className="text-3xl font-bold text-center mb-16"
                  style={{ color: colors.text }}
                >
                  Featured Collection
                </h2>

                {/* Featured Section (Artisan Collection) */}
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 max-w-6xl mx-auto px-6">
                  {/* Left Column - Image Card with Shadow */}
                  <div 
                    onClick={() => onProductClick?.({ 
                      id: 1, 
                      name: "Artisan Collection", 
                      price: 299.0,
                      description: "Handcrafted with attention to detail. Each piece tells a unique story.",
                      category: "Featured",
                      stock: "In Stock",
                      rating: 4.8,
                      reviews: 124
                    })}
                    className="bg-gray-200 rounded-xl aspect-4/5 shadow-2xl flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                  </div>

                  {/* Right Column - Text Content (NO Card Wrapper) */}
                  <div>
                    <div className="text-sm uppercase tracking-wide text-gray-500">
                      Featured
                    </div>
                    <h3 
                      onClick={() => onProductClick?.({ 
                        id: 1, 
                        name: "Artisan Collection", 
                        price: 299.0,
                        description: "Handcrafted with attention to detail. Each piece tells a unique story.",
                        category: "Featured",
                        stock: "In Stock",
                        rating: 4.8,
                        reviews: 124
                      })}
                      className="font-serif text-4xl font-bold text-gray-900 mt-2 cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      Artisan Collection
                    </h3>
                    <p className="text-gray-600 mt-4">
                      Handcrafted with attention to detail. Each piece tells a unique story.
                    </p>
                    <p 
                      className="text-3xl font-bold mt-6"
                      style={{ color: colors.secondary }}
                    >
                      $299.00
                    </p>
                    <button
                      onClick={() => addToCart({ id: 1, name: "Artisan Collection", price: 299.0 })}
                      className="text-white rounded-lg py-3 px-6 mt-6 font-medium transition-opacity hover:opacity-90"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      Add to Collection
                    </button>
                  </div>
                </div>

                {/* Secondary Items (Craft Items) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-24 px-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onProductClick?.({ 
                        id: i + 2, 
                        name: `Craft Item ${i + 1}`, 
                        price: 149.0,
                        description: "Handcrafted artisan product with unique design and exceptional quality.",
                        category: "Craft Collection",
                        stock: "In Stock",
                        rating: 4.5 + (i * 0.1),
                        reviews: 45 + (i * 10)
                      })}
                    >
                      {/* Image Card with Shadow */}
                      <div className="bg-gray-200 rounded-xl aspect-square shadow-2xl flex items-center justify-center">
                        <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      </div>
                      {/* Text Content - CENTERED */}
                      <div className="text-center mt-4">
                        <h4 
                          className="font-bold text-lg"
                          style={{ color: colors.text }}
                        >
                          Craft Item {i + 1}
                        </h4>
                        <p className="text-gray-500 mt-1">
                          $149.00
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : themeId === "studio" ? (
              /* Studio Theme - Refined Bento Box Layout */
              <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-fr">
                  {/* Product 1 - Large (2x2) */}
                  <div className="col-span-2 row-span-2 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    onClick={() => onProductClick?.({ 
                      id: 1, 
                      name: 'Premium Product', 
                      price: 299,
                      description: "Premium quality product with advanced features and elegant design.",
                      category: "Premium",
                      stock: "In Stock",
                      rating: 4.9,
                      reviews: 256
                    })}
                  >
                    <div className="h-full flex flex-col">
                      <div className="flex-1 bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative group overflow-hidden">
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                          style={{ backgroundColor: colors.secondary }}
                        ></div>
                        <svg className="w-32 h-32 text-blue-200 relative z-10 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-3" style={{ color: colors.text }}>
                          Premium Product
                        </h3>
                        <p className="text-3xl font-bold mb-4" style={{ color: colors.secondary }}>
                          $299.00
                        </p>
                        <button
                          onClick={() => addToCart({ id: 1, name: 'Premium Product', price: 299 })}
                          className="w-full text-white rounded-lg py-3 font-semibold transition-all hover:scale-105 transform"
                          style={{ backgroundColor: colors.secondary }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Products 2-3 - Tall (1x2) */}
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i + 1} className="col-span-1 row-span-2 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      onClick={() => onProductClick?.({ 
                        id: i + 2, 
                        name: `Product ${i + 2}`, 
                        price: 159 + i * 20,
                        description: "High-quality product designed for modern lifestyle and durability.",
                        category: "Studio Collection",
                        stock: "In Stock",
                        rating: 4.6 + (i * 0.1),
                        reviews: 89 + (i * 15)
                      })}
                    >
                      <div className="h-full flex flex-col">
                        <div className="flex-1 bg-linear-to-tl from-gray-50 to-gray-100 flex items-center justify-center relative group">
                          <svg className="w-24 h-24 text-gray-300 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                          </svg>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
                            Product {i + 2}
                          </h3>
                          <p className="text-xl font-bold mb-3" style={{ color: colors.secondary }}>
                            ${159 + i * 20}.00
                          </p>
                          <button
                            onClick={() => addToCart({ id: i + 2, name: `Product ${i + 2}`, price: 159 + i * 20 })}
                            className="w-full text-white rounded-lg py-2 font-semibold transition-opacity hover:opacity-90"
                            style={{ backgroundColor: colors.secondary }}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Products 4-7 - Standard (1x1) */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i + 4} className="col-span-1 row-span-1 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      onClick={() => onProductClick?.({ 
                        id: i + 4, 
                        name: `Product ${i + 4}`, 
                        price: 129 + i * 15,
                        description: "Quality product with excellent features for everyday use.",
                        category: "Standard",
                        stock: "In Stock",
                        rating: 4.4 + (i * 0.1),
                        reviews: 67 + (i * 8)
                      })}
                    >
                      <div className="aspect-square bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center relative group">
                        <svg className="w-20 h-20 text-gray-300 transform group-hover:rotate-6 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-bold mb-2 truncate" style={{ color: colors.text }}>
                          Product {i + 4}
                        </h3>
                        <p className="text-lg font-bold mb-3" style={{ color: colors.secondary }}>
                          ${129 + i * 15}.00
                        </p>
                        <button
                          onClick={() => addToCart({ id: i + 4, name: `Product ${i + 4}`, price: 129 + i * 15 })}
                          className="w-full text-white rounded-lg py-2 text-sm font-semibold transition-opacity hover:opacity-90"
                          style={{ backgroundColor: colors.secondary }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : layout.cardStyle === "minimal" && gridCols === 3 ? (
              <div className="space-y-8 max-w-5xl mx-auto">
                {/* Row 1: Image Left, Content Right */}
                <div className="grid grid-cols-2 gap-8 items-center">
                  <div 
                    onClick={() => onProductClick?.({ 
                      id: 1, 
                      name: "Product Name", 
                      price: 99.0,
                      description: "Exquisite craftsmanship meets timeless design. A statement piece for discerning collectors.",
                      category: "Featured",
                      stock: "In Stock",
                      rating: 4.7,
                      reviews: 98
                    })}
                    className="border rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" 
                    style={{ borderColor: colors.secondary }}
                  >
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 
                      onClick={() => onProductClick?.({ 
                        id: 1, 
                        name: "Product Name", 
                        price: 99.0,
                        description: "Exquisite craftsmanship meets timeless design. A statement piece for discerning collectors.",
                        category: "Featured",
                        stock: "In Stock",
                        rating: 4.7,
                        reviews: 98
                      })}
                      className="text-2xl font-normal mb-2 cursor-pointer hover:opacity-70 transition-opacity" 
                      style={{ color: colors.text }}
                    >
                      Product Name
                    </h3>
                    <p className="text-sm mb-4" style={{ color: colors.secondary, lineHeight: "1.6" }}>
                      Exquisite craftsmanship meets timeless design. A statement piece for discerning collectors.
                    </p>
                    <p className="text-2xl font-normal mb-4" style={{ color: colors.text }}>
                      $99.00
                    </p>
                    <button
                      onClick={() => addToCart({ id: 1, name: "Product Name", price: 99.0 })}
                      className="px-8 py-2 font-normal transition-opacity hover:opacity-90 border"
                      style={{
                        backgroundColor: "transparent",
                        color: colors.secondary,
                        borderColor: colors.secondary,
                        borderRadius: getButtonRadius(buttonStyle),
                        fontSize: `${typography.bodySize}px`,
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Row 2: Content Left, Image Right */}
                <div className="grid grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 
                      onClick={() => onProductClick?.({ 
                        id: 2, 
                        name: "Product Name", 
                        price: 99.0,
                        description: "Exquisite craftsmanship meets timeless design. A statement piece for discerning collectors.",
                        category: "Collection",
                        stock: "In Stock",
                        rating: 4.8,
                        reviews: 112
                      })}
                      className="text-2xl font-normal mb-2 cursor-pointer hover:opacity-70 transition-opacity" 
                      style={{ color: colors.text }}
                    >
                      Product Name
                    </h3>
                    <p className="text-sm mb-4" style={{ color: colors.secondary, lineHeight: "1.6" }}>
                      Exquisite craftsmanship meets timeless design. A statement piece for discerning collectors.
                    </p>
                    <p className="text-2xl font-normal mb-4" style={{ color: colors.text }}>
                      $99.00
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ id: 2, name: "Product Name", price: 99.0 });
                      }}
                      className="px-8 py-2 font-normal transition-opacity hover:opacity-90 border"
                      style={{
                        backgroundColor: "transparent",
                        color: colors.secondary,
                        borderColor: colors.secondary,
                        borderRadius: getButtonRadius(buttonStyle),
                        fontSize: `${typography.bodySize}px`,
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                  <div 
                    onClick={() => onProductClick?.({ 
                      id: 2, 
                      name: "Product Name", 
                      price: 99.0,
                      description: "Exquisite craftsmanship meets timeless design. A statement piece for discerning collectors.",
                      category: "Collection",
                      stock: "In Stock",
                      rating: 4.8,
                      reviews: 112
                    })}
                    className="border rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" 
                    style={{ borderColor: colors.secondary }}
                  >
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Row 3: Image Left, Content Right */}
                <div className="grid grid-cols-2 gap-8 items-center">
                  <div 
                    onClick={() => onProductClick?.({ 
                      id: 3, 
                      name: "Product Name", 
                      price: 99.0,
                      description: "Exquisite craftsmanship meets timeless design. A statement piece for discerning collectors.",
                      category: "Signature",
                      stock: "In Stock",
                      rating: 4.9,
                      reviews: 145
                    })}
                    className="border rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" 
                    style={{ borderColor: colors.secondary }}
                  >
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 
                      onClick={() => onProductClick?.({ 
                        id: 3, 
                        name: "Product Name", 
                        price: 99.0,
                        description: "Exquisite craftsmanship meets timeless design. A statement piece for discerning collectors.",
                        category: "Signature",
                        stock: "In Stock",
                        rating: 4.9,
                        reviews: 145
                      })}
                      className="text-2xl font-normal mb-2 cursor-pointer hover:opacity-70 transition-opacity" 
                      style={{ color: colors.text }}
                    >
                      Product Name
                    </h3>
                    <p className="text-sm mb-4" style={{ color: colors.secondary, lineHeight: "1.6" }}>
                      Exquisite craftsmanship meets timeless design. A statement piece for discerning collectors.
                    </p>
                    <p className="text-2xl font-normal mb-4" style={{ color: colors.text }}>
                      $99.00
                    </p>
                    <button
                      onClick={() => addToCart({ id: 3, name: "Product Name", price: 99.0 })}
                      className="px-8 py-2 font-normal transition-opacity hover:opacity-90 border"
                      style={{
                        backgroundColor: "transparent",
                        color: colors.secondary,
                        borderColor: colors.secondary,
                        borderRadius: getButtonRadius(buttonStyle),
                        fontSize: `${typography.bodySize}px`,
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ) : layout.cardStyle === "ordered" ? (
              /* Ordered/List Card Style */
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 flex gap-4 items-center cursor-pointer hover:shadow-md transition-shadow"
                    style={{ borderColor: colors.secondary }}
                    onClick={() => onProductClick?.({ 
                      id: i + 1, 
                      name: "Product Name", 
                      price: 99.0,
                      description: "High-quality product with excellent features and modern design.",
                      category: "Collection",
                      stock: "In Stock",
                      rating: 4.5 + (i * 0.05),
                      reviews: 45 + (i * 12)
                    })}
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center shrink-0">
                      <svg
                        className="w-10 h-10 text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-semibold mb-1"
                        style={{
                          fontSize: `${typography.bodySize}px`,
                          color: colors.text,
                        }}
                      >
                        Product Name
                      </h3>
                      <p
                        className="text-sm mb-2"
                        style={{ color: colors.secondary }}
                      >
                        Category • Brand
                      </p>
                      <p
                        className="font-semibold"
                        style={{
                          fontSize: `${typography.bodySize}px`,
                          color: colors.text,
                        }}
                      >
                        $99.00
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: i + 1,
                          name: "Product Name",
                          price: 99.0,
                        });
                      }}
                      className="px-6 py-2 font-medium transition-opacity hover:opacity-90 shrink-0"
                      style={{
                        backgroundColor: colors.secondary,
                        color: "#ffffff",
                        borderRadius: getButtonRadius(buttonStyle),
                        fontSize: `${typography.bodySize}px`,
                      }}
                    >
                      Quick Add
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* Standard Grid Layout (Dawn theme) */
              <div
                className="grid gap-6"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(
                    gridCols,
                    viewMode === "mobile"
                      ? 1
                      : viewMode === "tablet"
                      ? 2
                      : gridCols
                  )}, 1fr)`,
                  gap: `${layout.spacing}px`,
                }}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    style={{ borderColor: colors.secondary }}
                    onClick={() => onProductClick?.({ 
                      id: i + 1, 
                      name: "Product Name", 
                      price: 99.0,
                      description: "Discover amazing quality and style with this versatile product designed for your lifestyle.",
                      category: "Featured",
                      stock: "In Stock",
                      rating: 4.5 + (i * 0.05),
                      reviews: 78 + (i * 15)
                    })}
                  >
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                      </svg>
                    </div>
                    <div className="p-4">
                      <h3
                        className="font-semibold mb-1"
                        style={{
                          fontSize: `${typography.bodySize}px`,
                          color: colors.text,
                        }}
                      >
                        Product Name
                      </h3>
                      <p
                        className="mb-3"
                        style={{
                          fontSize: `${typography.bodySize}px`,
                          color: colors.text,
                        }}
                      >
                        $99.00
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            id: i + 1,
                            name: "Product Name",
                            price: 99.0,
                          });
                        }}
                        className="w-full py-2 font-medium transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: colors.secondary,
                          color: "#ffffff",
                          borderRadius: getButtonRadius(buttonStyle),
                          fontSize: `${typography.bodySize}px`,
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "promotional-banner":
        return (
          <div
            key={section.id}
            id="about"
            className="px-6 py-16 text-center"
            style={{
              backgroundColor: colors.secondary,
              color: "#ffffff",
            }}
          >
            <h2
              className="font-bold mb-2"
              style={{ fontSize: `${typography.headingSize * 0.8}px` }}
            >
              {section.content.heading || "Summer Sale"}
            </h2>
            <p
              className="mb-6"
              style={{ fontSize: `${typography.bodySize}px`, opacity: 0.9 }}
            >
              {section.content.subheading || "Up to 50% off on selected items"}
            </p>
            <button
              className="px-8 py-3 font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "#ffffff",
                color: colors.secondary,
                borderRadius: getButtonRadius(buttonStyle),
                fontSize: `${typography.bodySize}px`,
              }}
            >
              {section.content.buttonText || "View Sale"}
            </button>
          </div>
        );

      // case "newsletter":
      //   return (
      //     <div
      //       key={section.id}
      //       className="px-6 py-12 text-center border-b"
      //       style={{ borderColor: colors.secondary }}
      //     >
      //       <h2
      //         className="font-bold mb-2"
      //         style={{
      //           fontSize: `${typography.headingSize * 0.7}px`,
      //           color: colors.text,
      //         }}
      //       >
      //         {section.content.heading || "Stay Updated"}
      //       </h2>
      //       <p
      //         className="mb-6"
      //         style={{
      //           fontSize: `${typography.bodySize}px`,
      //           color: colors.secondary,
      //         }}
      //       >
      //         {section.content.description ||
      //           "Subscribe to our newsletter for exclusive offers and updates"}
      //       </p>
      //       <div className="flex gap-2 max-w-md mx-auto">
      //         <input
      //           type="email"
      //           placeholder="Enter your email"
      //           className="flex-1 px-4 py-2 border rounded"
      //           style={{
      //             borderColor: colors.secondary,
      //             fontSize: `${typography.bodySize}px`,
      //             borderRadius: getButtonRadius(buttonStyle),
      //           }}
      //         />
      //         <button
      //           className="px-6 py-2 font-medium transition-opacity hover:opacity-90"
      //           style={{
      //             backgroundColor: colors.primary,
      //             color: colors.background,
      //             borderRadius: getButtonRadius(buttonStyle),
      //             fontSize: `${typography.bodySize}px`,
      //           }}
      //         >
      //           {section.content.buttonText || "Subscribe"}
      //         </button>
      //       </div>
      //     </div>
      //   );

      // default:
      //   return null;
    }
  };

  return <>{sections.map((section) => renderSection(section))}</>;
}
