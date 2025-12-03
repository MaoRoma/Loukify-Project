"use client";

import { ThemeCustomizer } from "@/components/admin/online-store/customize/theme/ThemeCustomize";
import { ThemeProvider } from "@/lib/context/ThemeContext";

export default function CustomizeThemePage() {
  return (
    <ThemeProvider>
      <ThemeCustomizer />
    </ThemeProvider>
  );
}
