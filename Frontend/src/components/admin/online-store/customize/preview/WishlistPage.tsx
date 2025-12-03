"use client";

import { ArrowLeft, ShoppingCart, X } from "lucide-react";
import type {
  ThemeColors,
  ThemeTypography,
  ButtonStyle,
} from "@/lib/types/Theme";
import { getButtonRadius } from "@/lib/utils/ThemeHelper";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useCart } from "@/lib/context/CartContext";

interface WishlistPageProps {
  colors: ThemeColors;
  typography: ThemeTypography;
  buttonStyle: ButtonStyle;
  onBack: () => void;
  onProductClick?: (product: any) => void;
}

export function WishlistPage({
  colors,
  typography,
  buttonStyle,
  onBack,
  onProductClick,
}: WishlistPageProps) {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart(item);
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
        Back to Shopping
      </button>

      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontSize: `${typography.headingSize}px`, color: colors.text }}
      >
        My Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="w-24 h-24 mx-auto mb-4"
            style={{ color: colors.secondary, opacity: 0.3 }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h2
            className="font-semibold mb-2"
            style={{
              fontSize: `${typography.headingSize * 0.6}px`,
              color: colors.secondary,
            }}
          >
            Your Wishlist is Empty
          </h2>
          <p
            className="mb-6"
            style={{
              fontSize: `${typography.bodySize}px`,
              color: colors.secondary,
            }}
          >
            Add items you love to your wishlist
          </p>
          <button
            onClick={onBack}
            className="px-8 py-3 font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: colors.primary,
              color: colors.background,
              borderRadius: getButtonRadius(buttonStyle),
              fontSize: `${typography.bodySize}px`,
            }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg overflow-hidden relative group hover:shadow-lg transition-shadow"
              style={{ borderColor: colors.secondary }}
            >
              {/* Remove Button */}
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-md hover:bg-red-50 transition-colors"
                aria-label="Remove from wishlist"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>

              {/* Product Image */}
              <div
                onClick={() => onProductClick?.(item)}
                className="aspect-square bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                <svg
                  className="w-20 h-20 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3
                  onClick={() => onProductClick?.(item)}
                  className="font-semibold mb-1 cursor-pointer hover:opacity-70 transition-opacity"
                  style={{
                    fontSize: `${typography.bodySize}px`,
                    color: colors.text,
                  }}
                >
                  {item.name}
                </h3>
                
                {item.category && (
                  <p
                    className="text-sm mb-2"
                    style={{ color: colors.secondary }}
                  >
                    {item.category}
                  </p>
                )}

                {item.rating && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-3 h-3"
                          fill={star <= (item.rating || 0) ? "#FFC107" : "#E0E0E0"}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    {item.reviews && (
                      <span
                        className="text-xs"
                        style={{ color: colors.secondary }}
                      >
                        ({item.reviews})
                      </span>
                    )}
                  </div>
                )}

                <p
                  className="font-bold mb-3"
                  style={{
                    fontSize: `${typography.bodySize * 1.1}px`,
                    color: colors.primary,
                  }}
                >
                  ${item.price.toFixed(2)}
                </p>

                {item.stock && (
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-2 h-2 rounded-full`}
                      style={{
                        backgroundColor: item.stock === "In Stock" ? "#4CAF50" : "#F44336",
                      }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: colors.text }}
                    >
                      {item.stock}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full py-2 font-medium transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: colors.secondary,
                    color: "#ffffff",
                    borderRadius: getButtonRadius(buttonStyle),
                    fontSize: `${typography.bodySize}px`,
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
