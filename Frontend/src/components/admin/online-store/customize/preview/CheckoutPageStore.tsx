"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type {
  ThemeColors,
  ThemeTypography,
  ButtonStyle,
} from "@/lib/types/Theme";
import { getButtonRadius } from "@/lib/utils/ThemeHelper";
import { useCart } from "@/lib/context/CartContext";
import { api } from "@/lib/api/config";

interface CheckoutPageProps {
  colors: ThemeColors;
  typography: ThemeTypography;
  buttonStyle: ButtonStyle;
  onBackToCart: () => void;
  onConfirmOrder?: () => void;
}

export function CheckoutPage({
  colors,
  typography,
  buttonStyle,
  onBackToCart,
  onConfirmOrder,
}: CheckoutPageProps) {
  const { cartItems, cartTotal, clearCart } = useCart();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;

    if (!email || !fullName || !address) {
      setError("Please fill in Email, Full Name, and Address.");
      return;
    }

    try {
      setIsPlacingOrder(true);
      setError(null);

      const customerLocation = city ? `${address}, ${city}` : address;

      // 1) Create customer
      const customerResponse = await api.customers.create({
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone || undefined,
        customer_location: customerLocation,
      });

      const customer = customerResponse?.data;
      if (!customer || !customer.customer_id) {
        throw new Error("Failed to create customer record.");
      }

      // 2) Create order linked to this customer
      const orderItems = cartItems.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        product_sku: null,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      }));

      await api.orders.create({
        customer_id: customer.customer_id,
        total_price: cartTotal,
        date: new Date().toISOString(),
        order_items: orderItems,
      });

      // 3) Clear cart and reset form
      clearCart();
      setEmail("");
      setPhone("");
      setFullName("");
      setAddress("");
      setCity("");

      onConfirmOrder?.();
    } catch (err: any) {
      console.error("Failed to place order:", err);
      setError(
        err?.message ||
          "Failed to place order. Please check your information and try again."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

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
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border rounded"
                style={{
                  borderColor: colors.secondary,
                  fontSize: `${typography.bodySize}px`,
                  borderRadius: getButtonRadius(buttonStyle),
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 border rounded"
                style={{
                  borderColor: colors.secondary,
                  fontSize: `${typography.bodySize}px`,
                  borderRadius: getButtonRadius(buttonStyle),
                }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
            <button
              className="w-full px-4 py-3 border rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
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
            {error && (
              <div className="mb-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <button
              className="w-full py-3 font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
                borderRadius: getButtonRadius(buttonStyle),
                fontSize: `${typography.bodySize}px`,
              }}
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || cartItems.length === 0}
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
