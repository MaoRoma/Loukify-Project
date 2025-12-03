"use client";

import { ArrowLeft, Plus, Minus, ShoppingCart, Heart } from "lucide-react";
import type {
  ThemeColors,
  ThemeTypography,
  ButtonStyle,
} from "@/lib/types/Theme";
import { getButtonRadius } from "@/lib/utils/ThemeHelper";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useState } from "react";

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

interface ProductDetailPageProps {
  colors: ThemeColors;
  typography: ThemeTypography;
  buttonStyle: ButtonStyle;
  product: Product;
  onBack: () => void;
}

export function ProductDetailPage({
  colors,
  typography,
  buttonStyle,
  product,
  onBack,
}: ProductDetailPageProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        rating: product.rating,
        stock: product.stock,
        reviews: product.reviews,
      });
    }
  };

  // Mock images - in real app these would come from product data
  const productImages = [0, 1, 2, 3];

  return (
    <div className="px-6 py-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity"
        style={{ color: colors.text, fontSize: `${typography.bodySize}px` }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </button>

      {/* Product Detail */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Left: Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div
            className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
            style={{ borderColor: colors.secondary }}
          >
            <svg
              className="w-32 h-32 text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            {productImages.map((index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square bg-gray-100 rounded flex items-center justify-center border-2 transition-all hover:opacity-80`}
                style={{
                  borderColor: selectedImage === index ? colors.primary : colors.secondary,
                  opacity: selectedImage === index ? 1 : 0.6,
                }}
              >
                <svg
                  className="w-8 h-8 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Information */}
        <div className="space-y-6">
          {/* Product Title & Category */}
          <div>
            {product.category && (
              <p
                className="text-sm mb-2"
                style={{
                  color: colors.secondary,
                  fontSize: `${typography.bodySize * 0.9}px`,
                }}
              >
                {product.category}
              </p>
            )}
            <h1
              className="font-bold mb-3"
              style={{
                fontSize: `${typography.headingSize * 0.8}px`,
                color: colors.text,
              }}
            >
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4"
                      fill={star <= (product.rating || 0) ? "#FFC107" : "#E0E0E0"}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                {product.reviews && (
                  <span
                    style={{
                      color: colors.secondary,
                      fontSize: `${typography.bodySize * 0.9}px`,
                    }}
                  >
                    ({product.reviews} reviews)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <p
              className="font-bold"
              style={{
                fontSize: `${typography.headingSize * 0.6}px`,
                color: colors.primary,
              }}
            >
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Stock Status */}
          {product.stock && (
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full`}
                style={{
                  backgroundColor: product.stock === "In Stock" ? "#4CAF50" : "#F44336",
                }}
              />
              <span
                style={{
                  color: colors.text,
                  fontSize: `${typography.bodySize}px`,
                }}
              >
                {product.stock}
              </span>
            </div>
          )}

          {/* Description */}
          <div
            className="border-t border-b py-4"
            style={{ borderColor: colors.secondary, opacity: 0.3 }}
          >
            <p
              style={{
                fontSize: `${typography.bodySize}px`,
                color: colors.secondary,
                lineHeight: 1.6,
              }}
            >
              {product.description ||
                "Experience exceptional quality and style with this premium product. Crafted with attention to detail and designed to exceed your expectations."}
            </p>
          </div>

          {/* Quantity Selector */}
          <div>
            <label
              className="block mb-2 font-medium"
              style={{
                fontSize: `${typography.bodySize}px`,
                color: colors.text,
              }}
            >
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg" style={{ borderColor: colors.secondary }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                  style={{ color: colors.text }}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span
                  className="px-6 py-2 min-w-[60px] text-center font-medium"
                  style={{
                    fontSize: `${typography.bodySize}px`,
                    color: colors.text,
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                  style={{ color: colors.text }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 px-6 font-medium transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
                borderRadius: getButtonRadius(buttonStyle),
                fontSize: `${typography.bodySize}px`,
              }}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className="p-3 border-2 transition-all hover:opacity-80"
              style={{
                borderColor: isWishlisted ? colors.primary : colors.secondary,
                backgroundColor: isWishlisted ? colors.primary : "transparent",
                color: isWishlisted ? colors.background : colors.text,
                borderRadius: getButtonRadius(buttonStyle),
              }}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className="w-5 h-5"
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Additional Info */}
          <div
            className="border rounded-lg p-4 space-y-3"
            style={{ borderColor: colors.secondary, opacity: 0.3 }}
          >
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 shrink-0 mt-0.5"
                style={{ color: colors.secondary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <div>
                <p
                  className="font-medium"
                  style={{
                    fontSize: `${typography.bodySize * 0.95}px`,
                    color: colors.text,
                  }}
                >
                  Free Shipping
                </p>
                <p
                  style={{
                    fontSize: `${typography.bodySize * 0.85}px`,
                    color: colors.secondary,
                  }}
                >
                  On orders over $50
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 shrink-0 mt-0.5"
                style={{ color: colors.secondary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p
                  className="font-medium"
                  style={{
                    fontSize: `${typography.bodySize * 0.95}px`,
                    color: colors.text,
                  }}
                >
                  Quality Guarantee
                </p>
                <p
                  style={{
                    fontSize: `${typography.bodySize * 0.85}px`,
                    color: colors.secondary,
                  }}
                >
                  30-day money back guarantee
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 shrink-0 mt-0.5"
                style={{ color: colors.secondary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <div>
                <p
                  className="font-medium"
                  style={{
                    fontSize: `${typography.bodySize * 0.95}px`,
                    color: colors.text,
                  }}
                >
                  Secure Payment
                </p>
                <p
                  style={{
                    fontSize: `${typography.bodySize * 0.85}px`,
                    color: colors.secondary,
                  }}
                >
                  Your payment information is safe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
