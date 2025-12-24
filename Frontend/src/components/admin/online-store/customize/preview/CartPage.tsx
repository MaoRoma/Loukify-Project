"use client";

import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import type {
  ThemeColors,
  ThemeTypography,
  ButtonStyle,
} from "@/lib/types/Theme";
import { getButtonRadius } from "@/lib/utils/ThemeHelper";
import { useCart } from "@/lib/context/CartContext";

interface CartPageProps {
  colors: ThemeColors;
  typography: ThemeTypography;
  buttonStyle: ButtonStyle;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

export function CartPage({
  colors,
  typography,
  buttonStyle,
  onContinueShopping,
  onCheckout,
}: CartPageProps) {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, cartTotal } =
    useCart();

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-12">
      <h1
        className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8"
        style={{ fontSize: `${typography.headingSize}px`, color: colors.text }}
      >
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <ShoppingCart
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
            Your Cart is Empty
          </h2>
          <p
            className="mb-6"
            style={{
              fontSize: `${typography.bodySize}px`,
              color: colors.secondary,
            }}
          >
            Add some products to get started
          </p>
          <button
            onClick={onContinueShopping}
            className="px-6 sm:px-8 py-3 font-medium transition-opacity hover:opacity-90 min-h-[44px] text-base sm:text-sm"
            style={{
              backgroundColor: colors.primary,
              color: colors.background,
              borderRadius: getButtonRadius(buttonStyle),
              fontSize: `${typography.bodySize}px`,
            }}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-3 sm:p-4 flex gap-3 sm:gap-4"
                style={{ borderColor: colors.secondary }}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
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
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3
                        className="font-semibold"
                        style={{
                          fontSize: `${typography.bodySize}px`,
                          color: colors.text,
                        }}
                      >
                        {item.name}
                      </h3>
                      <p
                        className="font-semibold mt-1"
                        style={{
                          fontSize: `${typography.bodySize}px`,
                          color: colors.text,
                        }}
                      >
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 hover:bg-gray-100 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
                      style={{ color: colors.secondary }}
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 border rounded hover:bg-gray-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      style={{ borderColor: colors.secondary }}
                      disabled={(item.quantity || 1) <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus
                        className="w-4 h-4"
                        style={{ color: colors.text }}
                      />
                    </button>
                    <span
                      className="px-3 sm:px-4 py-2 border rounded text-center min-w-[3rem] min-h-[44px] flex items-center justify-center"
                      style={{
                        borderColor: colors.secondary,
                        fontSize: `${typography.bodySize}px`,
                        color: colors.text,
                      }}
                    >
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-2 border rounded hover:bg-gray-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      style={{ borderColor: colors.secondary }}
                      aria-label="Increase quantity"
                    >
                      <Plus
                        className="w-4 h-4"
                        style={{ color: colors.text }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div
              className="border rounded-lg p-4 sm:p-6 lg:sticky lg:top-4"
              style={{ borderColor: colors.secondary }}
            >
              <h2
                className="text-lg sm:text-xl font-bold mb-4 sm:mb-6"
                style={{
                  fontSize: `${typography.headingSize * 0.6}px`,
                  color: colors.text,
                }}
              >
                Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div
                  className="flex justify-between"
                  style={{ fontSize: `${typography.bodySize}px` }}
                >
                  <span style={{ color: colors.text }}>Subtotal</span>
                  <span style={{ color: colors.text }}>
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>
                <div
                  className="flex justify-between"
                  style={{ fontSize: `${typography.bodySize}px` }}
                >
                  <span style={{ color: colors.text }}>Shipping</span>
                  <span style={{ color: colors.text }}>Free</span>
                </div>
                <div
                  className="border-t pt-3 flex justify-between font-bold"
                  style={{
                    borderColor: colors.secondary,
                    fontSize: `${typography.bodySize}px`,
                  }}
                >
                  <span style={{ color: colors.text }}>Total</span>
                  <span style={{ color: colors.text }}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={onCheckout}
                className="w-full py-3 font-medium mb-3 transition-opacity hover:opacity-90 min-h-[44px] text-base sm:text-sm"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                  borderRadius: getButtonRadius(buttonStyle),
                  fontSize: `${typography.bodySize}px`,
                }}
              >
                Checkout
              </button>
              <button
                onClick={onContinueShopping}
                className="w-full py-3 font-medium border transition-colors hover:bg-gray-50 min-h-[44px] text-base sm:text-sm"
                style={{
                  borderColor: colors.text,
                  color: colors.text,
                  borderRadius: getButtonRadius(buttonStyle),
                  fontSize: `${typography.bodySize}px`,
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
