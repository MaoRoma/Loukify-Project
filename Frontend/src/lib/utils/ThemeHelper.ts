import type { ButtonStyle } from "@/lib/types/Theme"

export function getButtonRadius(buttonStyle: ButtonStyle): string {
  switch (buttonStyle) {
    case "square":
      return "0px"
    case "rounded":
      return "6px"
    case "pill":
      return "9999px"
  }
}

export function getViewportWidth(viewMode: "desktop" | "tablet" | "mobile"): string {
  switch (viewMode) {
    case "desktop":
      return "100%"
    case "tablet":
      return "768px"
    case "mobile":
      return "375px"
  }
}

export function getFontFamilyStyle(fontName: string): string {
  return `'${fontName}', sans-serif`;
}
