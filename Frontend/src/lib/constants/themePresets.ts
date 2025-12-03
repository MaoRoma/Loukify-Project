import type {
  ThemeColors,
  ThemeTypography,
  ThemeLayout,
  ButtonStyle,
  HeaderConfig,
  Section,
  FooterConfig,
} from "@/lib/types/Theme";

export interface ThemePreset {
  id: string;
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  layout: ThemeLayout;
  buttonStyle: ButtonStyle;
  header: HeaderConfig;
  sections: Section[];
  footer: FooterConfig;
}

// Dawn Theme (Default)
export const dawnTheme: ThemePreset = {
  id: "dawn",
  name: "Dawn",
  colors: {
    primary: "#292524",
    secondary: "#78716c",
    accent: "#0c0a09",
    background: "#ffffff",
    text: "#0c0a09",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    headingSize: 39,
    bodySize: 16,
  },
  layout: {
    productsPerRow: 4,
    spacing: 24,
    cardStyle: "minimal",
  },
  buttonStyle: "rounded",
  header: {
    logoText: "Your Store",
    layout: "minimal",
    showAnnouncement: true,
    announcementText: "Free shipping on orders over $50",
    navigationItems: ["Home", "Shop", "About", "Contact"],
    showSearchBar: false,
    showWishlistIcon: false,
  },
  sections: [
    {
      id: "hero",
      type: "hero",
      name: "Hero Banner",
      subtitle: "Hero",
      enabled: true,
      expanded: false,
      content: {
        heading: "Welcome to Our Store",
        subheading: "Discover amazing products at great prices",
        buttonText: "Shop Now",
      },
    },
    {
      id: "featured",
      type: "featured-products",
      name: "Featured Products",
      subtitle: "Featured-Products",
      enabled: true,
      expanded: false,
      content: {
        heading: "Featured Collection",
        description: "Check out our bestselling products",
      },
    },
    {
      id: "promo",
      type: "promotional-banner",
      name: "Promotional Banner",
      subtitle: "Banner",
      enabled: true,
      expanded: false,
      content: {
        heading: "Summer Sale",
        subheading: "Up to 50% off on selected items",
        buttonText: "View Sale",
      },
    },
  ],
  footer: {
    columns: 4,
    backgroundColor: "#ffffff",
    columnSettings: {
      column1: {
        title: "About",
        links: [
          { label: "Our Story", url: "/about" },
          { label: "Career", url: "/careers" },
          { label: "Press", url: "/press" },
        ],
      },
      column2: {
        title: "About",
        links: [
          { label: "Our Story", url: "/about" },
          { label: "Career", url: "/careers" },
          { label: "Press", url: "/press" },
        ],
      },
      column3: {
        title: "About",
        links: [
          { label: "Our Story", url: "/about" },
          { label: "Career", url: "/careers" },
          { label: "Press", url: "/press" },
        ],
      },
      column4: {
        title: "About",
        links: [
          { label: "Our Story", url: "/about" },
          { label: "Career", url: "/careers" },
          { label: "Press", url: "/press" },
        ],
      },
    },
    showNewsletter: false,
    newsletterTitle: "",
    newsletterDescription: "",
    showSocialIcons: true,
    socialLinks: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
    contactInfo: {
      email: "support@yourstore.com",
      phone: "+1 234 567 890",
      address: "123 Store Street, City, Country",
    },
    showPaymentIcons: true,
    copyrightText: "© 2025 Your Store. All rights reserved.",
  },
};

// Sence Theme - Matching Figma Design
export const senceTheme: ThemePreset = {
  id: "sense",
  name: "Sence",
  colors: {
    primary: "#1a1a1a", // Dark header/text
    secondary: "#D4AF37", // Gold/yellow accent for buttons
    accent: "#C9A961", // Lighter gold for hover states
    background: "#F5F5F5", // Light gray background
    text: "#1a1a1a", // Dark text
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    headingSize: 48,
    bodySize: 14,
  },
  layout: {
    productsPerRow: 3,
    spacing: 20,
    cardStyle: "minimal",
  },
  buttonStyle: "rounded",
  header: {
    logoText: "Your Store",
    layout: "centered",
    showAnnouncement: true,
    announcementText: "Free shipping on orders over $50",
    navigationItems: ["Home", "Shop", "About", "Contact"],
    showSearchBar: false,
    showWishlistIcon: false,
  },
  sections: [
    {
      id: "hero",
      type: "hero",
      name: "Hero Banner",
      subtitle: "Hero",
      enabled: true,
      expanded: false,
      content: {
        heading: "Welcome to Our Store",
        subheading: "Discover amazing products at great prices",
        buttonText: "Shop Now",
      },
    },
    {
      id: "featured",
      type: "featured-products",
      name: "Featured Products",
      subtitle: "Featured-Products",
      enabled: true,
      expanded: false,
      content: {
        heading: "Feature Collection",
        description: "Exquisite craftsmanship meets timeless design. A statement piece for discerning collectors.",
      },
    },
    {
      id: "promo",
      type: "promotional-banner",
      name: "Promotional Banner",
      subtitle: "Banner",
      enabled: true,
      expanded: false,
      content: {
        heading: "Summer Sale",
        subheading: "Up to 50% off on selected items",
        buttonText: "View Sale",
      },
    },
  ],
  footer: {
    columns: 4,
    backgroundColor: "#F5F5F5",
    columnSettings: {
      column1: {
        title: "About",
        links: [
          { label: "Our Story", url: "/about" },
          { label: "Career", url: "/careers" },
          { label: "Press", url: "/press" },
        ],
      },
      column2: {
        title: "About",
        links: [
          { label: "Our Story", url: "/about" },
          { label: "Career", url: "/careers" },
          { label: "Press", url: "/press" },
        ],
      },
      column3: {
        title: "About",
        links: [
          { label: "Our Story", url: "/about" },
          { label: "Career", url: "/careers" },
          { label: "Press", url: "/press" },
        ],
      },
      column4: {
        title: "About",
        links: [
          { label: "Our Story", url: "/about" },
          { label: "Career", url: "/careers" },
          { label: "Press", url: "/press" },
        ],
      },
    },
    showNewsletter: false,
    newsletterTitle: "",
    newsletterDescription: "",
    showSocialIcons: false,
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    },
    contactInfo: {
      email: "support@yourstore.com",
      phone: "",
      address: "",
    },
    showPaymentIcons: true,
    copyrightText: "© 2025 Your Store. All rights reserved.",
  },
};

// Craft Theme - Artisan/Featured Layout
export const craftTheme: ThemePreset = {
  id: "craft",
  name: "Craft",
  colors: {
    primary: "#2c2c2c", // Dark text
    secondary: "#E67E22", // Orange accent for buttons
    accent: "#D35400", // Darker orange for hover
    background: "#FAFAFA", // Off-white background
    text: "#2c2c2c", // Dark text
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    headingSize: 36,
    bodySize: 14,
  },
  layout: {
    productsPerRow: 4, // Special: 1 large + 3 small
    spacing: 20,
    cardStyle: "minimal",
  },
  buttonStyle: "rounded",
  header: {
    logoText: "Your Store",
    layout: "centered",
    showAnnouncement: true,
    announcementText: "Free shipping on orders over $50",
    navigationItems: ["Home", "Shop", "About", "Contact"],
    showSearchBar: false,
    showWishlistIcon: false,
  },
  sections: [
    {
      id: "hero",
      type: "hero",
      name: "Hero Banner",
      subtitle: "Hero",
      enabled: true,
      expanded: false,
      content: {
        heading: "Welcome to Our Store",
        subheading: "Discover amazing products at great prices",
        buttonText: "Shop Now",
      },
    },
    {
      id: "featured",
      type: "featured-products",
      name: "Featured Products",
      subtitle: "Featured-Products",
      enabled: true,
      expanded: false,
      content: {
        heading: "Featured Collection",
        description: "Handcrafted with attention to detail. Each piece tells a unique story.",
      },
    },
    {
      id: "promo",
      type: "promotional-banner",
      name: "Promotional Banner",
      subtitle: "Banner",
      enabled: true,
      expanded: false,
      content: {
        heading: "Summer Sale",
        subheading: "Up to 50% off on selected items",
        buttonText: "View Sale",
      },
    },
  ],
  footer: {
    columns: 4,
    backgroundColor: "#FAFAFA",
    columnSettings: {
      column1: {
        title: "About",
        links: [
          { label: "Our Story", url: "/about" },
          { label: "Career", url: "/careers" },
          { label: "Press", url: "/press" },
        ],
      },
      column2: {
        title: "About",
        links: [
          { label: "Our Story", url: "/about" },
          { label: "Career", url: "/careers" },
          { label: "Press", url: "/press" },
        ],
      },
      column3: {
        title: "About",
        links: [
          { label: "Our Story", url: "/about" },
          { label: "Career", url: "/careers" },
          { label: "Press", url: "/press" },
        ],
      },
      column4: {
        title: "About",
        links: [
          { label: "Our Story", url: "/about" },
          { label: "Career", url: "/careers" },
          { label: "Press", url: "/press" },
        ],
      },
    },
    showNewsletter: false,
    newsletterTitle: "",
    newsletterDescription: "",
    showSocialIcons: true,
    socialLinks: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
    contactInfo: {
      email: "support@yourstore.com",
      phone: "+1 234 567 890",
      address: "123 Store Street, City, Country",
    },
    showPaymentIcons: true,
    copyrightText: "© 2025 Your Store. All rights reserved.",
  },
};

// Studio Theme - Professional List Layout
export const studioTheme: ThemePreset = {
  id: "studio",
  name: "Studio",
  colors: {
    primary: "#1a1a1a", // Dark text
    secondary: "#3498db", // Blue accent for buttons
    accent: "#2980b9", // Darker blue for hover
    background: "#ffffff", // White background
    text: "#1a1a1a", // Dark text
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    headingSize: 32,
    bodySize: 15,
  },
  layout: {
    productsPerRow: 2, // List layout identifier
    spacing: 16,
    cardStyle: "ordered",
  },
  buttonStyle: "rounded",
  header: {
    logoText: "Your Store",
    layout: "minimal",
    showAnnouncement: true,
    announcementText: "Free shipping on orders over $50",
    navigationItems: ["Home", "Shop", "About", "Contact"],
    showSearchBar: false,
    showWishlistIcon: false,
  },
  sections: [
    {
      id: "hero",
      type: "hero",
      name: "Hero Banner",
      subtitle: "Hero",
      enabled: true,
      expanded: false,
      content: {
        heading: "Welcome to Our Store",
        subheading: "Discover amazing products at great prices",
        buttonText: "Shop Now",
      },
    },
    {
      id: "featured",
      type: "featured-products",
      name: "Featured Products",
      subtitle: "Featured-Products",
      enabled: true,
      expanded: false,
      content: {
        heading: "Featured Collection",
        description: "Professional catalog view for detailed product browsing",
      },
    },
    {
      id: "promo",
      type: "promotional-banner",
      name: "Promotional Banner",
      subtitle: "Banner",
      enabled: true,
      expanded: false,
      content: {
        heading: "Summer Sale",
        subheading: "Up to 50% off on selected items",
        buttonText: "View Sale",
      },
    },
  ],
  footer: {
    columns: 4,
    backgroundColor: "#f8f9fa",
    columnSettings: {
      column1: {
        title: "Shop",
        links: [
          { label: "New Arrivals", url: "/new" },
          { label: "Best Sellers", url: "/best-sellers" },
          { label: "Sale", url: "/sale" },
        ],
      },
      column2: {
        title: "Support",
        links: [
          { label: "FAQ", url: "/faq" },
          { label: "Shipping", url: "/shipping" },
          { label: "Returns", url: "/returns" },
        ],
      },
      column3: {
        title: "Company",
        links: [
          { label: "About Us", url: "/about" },
          { label: "Contact", url: "/contact" },
          { label: "Blog", url: "/blog" },
        ],
      },
      column4: {
        title: "About",
        links: [
          { label: "Our Story", url: "/about" },
          { label: "Career", url: "/careers" },
          { label: "Press", url: "/press" },
        ],
      },
    },
    showNewsletter: false,
    newsletterTitle: "",
    newsletterDescription: "",
    showSocialIcons: true,
    socialLinks: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
    contactInfo: {
      email: "support@yourstore.com",
      phone: "+1 234 567 890",
      address: "123 Store Street, City, Country",
    },
    showPaymentIcons: true,
    copyrightText: "© 2025 Your Store. All rights reserved.",
  },
};

// Export all theme presets
export const themePresets: Record<string, ThemePreset> = {
  dawn: dawnTheme,
  sense: senceTheme,
  craft: craftTheme,
  studio: studioTheme,
};

// Helper function to get theme by ID
export const getThemeById = (id: string): ThemePreset => {
  return themePresets[id] || dawnTheme;
};
