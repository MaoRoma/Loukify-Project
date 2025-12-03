"use client";

import { useState } from "react";
import { ArrowLeft, Search as SearchIcon, X } from "lucide-react";
import type {
  ThemeColors,
  ThemeTypography,
  ButtonStyle,
} from "@/lib/types/Theme";
import { getButtonRadius } from "@/lib/utils/ThemeHelper";
import { useCart } from "@/lib/context/CartContext";

interface SearchPageProps {
  colors: ThemeColors;
  typography: ThemeTypography;
  buttonStyle: ButtonStyle;
  onBack: () => void;
  onProductClick?: (product: any) => void;
}

// Mock products for search
const allProducts = [
  { id: 1, name: "Premium Product", price: 299, category: "Premium", stock: "In Stock", rating: 4.9, reviews: 256 },
  { id: 2, name: "Artisan Collection", price: 299, category: "Featured", stock: "In Stock", rating: 4.8, reviews: 124 },
  { id: 3, name: "Craft Item 1", price: 149, category: "Craft Collection", stock: "In Stock", rating: 4.5, reviews: 45 },
  { id: 4, name: "Craft Item 2", price: 149, category: "Craft Collection", stock: "In Stock", rating: 4.6, reviews: 55 },
  { id: 5, name: "Craft Item 3", price: 149, category: "Craft Collection", stock: "In Stock", rating: 4.7, reviews: 65 },
  { id: 6, name: "Product 2", price: 159, category: "Studio Collection", stock: "In Stock", rating: 4.6, reviews: 89 },
  { id: 7, name: "Product 3", price: 179, category: "Studio Collection", stock: "In Stock", rating: 4.7, reviews: 104 },
  { id: 8, name: "Product Name", price: 99, category: "Featured", stock: "In Stock", rating: 4.7, reviews: 98 },
];

export function SearchPage({
  colors,
  typography,
  buttonStyle,
  onBack,
  onProductClick,
}: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();

  const filteredProducts = searchQuery.trim()
    ? allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="px-6 py-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity"
        style={{ color: colors.text, fontSize: `${typography.bodySize}px` }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontSize: `${typography.headingSize}px`, color: colors.text }}
      >
        Search Products
      </h1>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: colors.secondary }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name or category..."
            className="w-full pl-12 pr-12 py-4 border-2 focus:outline-none focus:border-opacity-100 transition-colors"
            style={{
              borderColor: colors.secondary,
              borderRadius: getButtonRadius(buttonStyle),
              fontSize: `${typography.bodySize}px`,
              color: colors.text,
            }}
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
            >
              <X className="w-5 h-5" style={{ color: colors.secondary }} />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {!searchQuery.trim() ? (
        <div className="text-center py-16">
          <SearchIcon
            className="w-24 h-24 mx-auto mb-4"
            style={{ color: colors.secondary, opacity: 0.3 }}
          />
          <h2
            className="font-semibold mb-2"
            style={{
              fontSize: `${typography.headingSize * 0.6}px`,
              color: colors.secondary,
            }}
          >
            Start Searching
          </h2>
          <p
            style={{
              fontSize: `${typography.bodySize}px`,
              color: colors.secondary,
            }}
          >
            Type in the search box to find products
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <SearchIcon
            className="w-24 h-24 mx-auto mb-4"
            style={{ color: colors.secondary, opacity: 0.3 }}
          />
          <h2
            className="font-semibold mb-2"
            style={{
              fontSize: `${typography.headingSize * 0.6}px`,
              color: colors.secondary,
            }}
          >
            No Results Found
          </h2>
          <p
            style={{
              fontSize: `${typography.bodySize}px`,
              color: colors.secondary,
            }}
          >
            Try searching with different keywords
          </p>
        </div>
      ) : (
        <>
          <p
            className="mb-6"
            style={{
              fontSize: `${typography.bodySize}px`,
              color: colors.secondary,
            }}
          >
            Found {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                style={{ borderColor: colors.secondary }}
                onClick={() => onProductClick?.(product)}
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
                    {product.name}
                  </h3>
                  <p
                    className="text-sm mb-2"
                    style={{ color: colors.secondary }}
                  >
                    {product.category}
                  </p>
                  {product.rating && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="w-3 h-3"
                            fill={star <= (product.rating || 0) ? "#FFC107" : "#E0E0E0"}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span
                        className="text-xs"
                        style={{ color: colors.secondary }}
                      >
                        ({product.reviews})
                      </span>
                    </div>
                  )}
                  <p
                    className="font-bold mb-3"
                    style={{
                      fontSize: `${typography.bodySize * 1.1}px`,
                      color: colors.primary,
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
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
        </>
      )}
    </div>
  );
}
