"use client";

import { CurrentTheme } from "@/components/admin/online-store/customize/theme/CurrentTheme";
import { ThemeLibrary } from "@/components/admin/online-store/customize/theme/ThemeLibrary";
import { ThemeProvider } from "@/lib/context/ThemeContext";

const OnlineStore = () => {
  return (
    <ThemeProvider>
      <CurrentTheme />
      <ThemeLibrary />
    </ThemeProvider>
  );
};

export default OnlineStore;
