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
    <div className="px-6 py-12">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontSize: `${typography.headingSize}px`, color: colors.text }}
      >
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
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
            className="px-8 py-3 font-medium transition-opacity hover:opacity-90"
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
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 flex gap-4"
                style={{ borderColor: colors.secondary }}
              >
                <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-12 h-12 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </svg>
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
                      className="p-1 hover:bg-gray-100 rounded"
                      style={{ color: colors.secondary }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 border rounded hover:bg-gray-50"
                      style={{ borderColor: colors.secondary }}
                      disabled={(item.quantity || 1) <= 1}
                    >
                      <Minus
                        className="w-4 h-4"
                        style={{ color: colors.text }}
                      />
                    </button>
                    <span
                      className="px-3 py-1 border rounded text-center min-w-[3rem]"
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
                      className="p-1 border rounded hover:bg-gray-50"
                      style={{ borderColor: colors.secondary }}
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
          <div className="md:col-span-1">
            <div
              className="border rounded-lg p-6 sticky top-4"
              style={{ borderColor: colors.secondary }}
            >
              <h2
                className="text-xl font-bold mb-6"
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
                className="w-full py-3 font-medium mb-3 transition-opacity hover:opacity-90"
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
                className="w-full py-3 font-medium border transition-colors hover:bg-gray-50"
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
