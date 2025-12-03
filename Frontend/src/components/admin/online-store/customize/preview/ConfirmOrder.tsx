"use client";

import { CheckCircle } from "lucide-react";
import type {
  ThemeColors,
  ThemeTypography,
  ButtonStyle,
} from "@/lib/types/Theme";
import { getButtonRadius } from "@/lib/utils/ThemeHelper";

interface ConfirmOrderProps {
  colors: ThemeColors;
  typography: ThemeTypography;
  buttonStyle: ButtonStyle;
  onContinueShopping: () => void;
}

export function ConfirmOrder({
  colors,
  typography,
  buttonStyle,
  onContinueShopping,
}: ConfirmOrderProps) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="max-w-md mx-auto">
        <CheckCircle
          className="w-16 h-16 mx-auto mb-6"
          style={{ color: colors.primary }}
        />

        <h1
          className="text-3xl font-bold mb-4"
          style={{
            fontSize: `${typography.headingSize}px`,
            color: colors.text,
          }}
        >
          Order Confirmed!
        </h1>

        <p
          className="mb-8"
          style={{
            fontSize: `${typography.bodySize}px`,
            color: colors.text,
          }}
        >
          Thank you for your order. You will receive a confirmation email
          shortly.
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
    </div>
  );
}
