"use client";

import { ArrowLeft } from "lucide-react";
import type {
  ThemeColors,
  ThemeTypography,
  ButtonStyle,
} from "@/lib/types/Theme";
import { getButtonRadius } from "@/lib/utils/ThemeHelper";
import { useCart } from "@/lib/context/CartContext";

interface CheckoutPageProps {
  colors: ThemeColors;
  typography: ThemeTypography;
  buttonStyle: ButtonStyle;
  onBackToCart: () => void;
  onConfirmOrder?: () => void; // This prop exists but isn't being used
}

export function CheckoutPage({
  colors,
  typography,
  buttonStyle,
  onBackToCart,
  onConfirmOrder, // Add this parameter
}: CheckoutPageProps) {
  const { cartItems, cartTotal, clearCart } = useCart();

  return (
    <div className="px-6 py-12">
      {/* Back to Cart Link */}
      <button
        onClick={onBackToCart}
        className="flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity"
        style={{ color: colors.text, fontSize: `${typography.bodySize}px` }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </button>

      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontSize: `${typography.headingSize}px`, color: colors.text }}
      >
        Checkout
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact Information */}
          <div
            className="border rounded-lg p-6"
            style={{ borderColor: colors.secondary }}
          >
            <h2
              className="font-semibold mb-4"
              style={{
                fontSize: `${typography.bodySize * 1.1}px`,
                color: colors.text,
              }}
            >
              Contact Information
            </h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border rounded"
              style={{
                borderColor: colors.secondary,
                fontSize: `${typography.bodySize}px`,
                borderRadius: getButtonRadius(buttonStyle),
              }}
            />
          </div>

          {/* Shipping Address */}
          <div
            className="border rounded-lg p-6"
            style={{ borderColor: colors.secondary }}
          >
            <h2
              className="font-semibold mb-4"
              style={{
                fontSize: `${typography.bodySize * 1.1}px`,
                color: colors.text,
              }}
            >
              Shipping Address
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border rounded"
                style={{
                  borderColor: colors.secondary,
                  fontSize: `${typography.bodySize}px`,
                  borderRadius: getButtonRadius(buttonStyle),
                }}
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full px-4 py-3 border rounded"
                style={{
                  borderColor: colors.secondary,
                  fontSize: `${typography.bodySize}px`,
                  borderRadius: getButtonRadius(buttonStyle),
                }}
              />
              <input
                type="text"
                placeholder="City"
                className="w-full px-4 py-3 border rounded"
                style={{
                  borderColor: colors.secondary,
                  fontSize: `${typography.bodySize}px`,
                  borderRadius: getButtonRadius(buttonStyle),
                }}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div
            className="border rounded-lg p-6"
            style={{ borderColor: colors.secondary }}
          >
            <h2
              className="font-semibold mb-4"
              style={{
                fontSize: `${typography.bodySize * 1.1}px`,
                color: colors.text,
              }}
            >
              Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="px-4 py-3 border rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                style={{
                  borderColor: colors.secondary,
                  fontSize: `${typography.bodySize}px`,
                  borderRadius: getButtonRadius(buttonStyle),
                  color: colors.text,
                }}
              >
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                ABA Bank
              </button>
              <button
                className="px-4 py-3 border rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                style={{
                  borderColor: colors.secondary,
                  fontSize: `${typography.bodySize}px`,
                  borderRadius: getButtonRadius(buttonStyle),
                  color: colors.text,
                }}
              >
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  W
                </div>
                Wing
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
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
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span style={{ color: colors.text }}>
                    {item.name} x {item.quantity}
                  </span>
                  <span style={{ color: colors.text }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="space-y-3 mb-6 pt-4 border-t"
              style={{ borderColor: colors.secondary }}
            >
              <div
                className="flex justify-between"
                style={{ fontSize: `${typography.bodySize}px` }}
              >
                <span style={{ color: colors.text }}>Shipping</span>
                <span style={{ color: colors.text }}>Free</span>
              </div>
              <div
                className="flex justify-between font-bold"
                style={{ fontSize: `${typography.bodySize * 1.1}px` }}
              >
                <span style={{ color: colors.text }}>Total</span>
                <span style={{ color: colors.text }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              className="w-full py-3 font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
                borderRadius: getButtonRadius(buttonStyle),
                fontSize: `${typography.bodySize}px`,
              }}
              onClick={() => {
                clearCart(); // Clear cart after order is placed
                onConfirmOrder?.();
              }}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
