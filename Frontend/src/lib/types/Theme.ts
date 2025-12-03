export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  headingSize: number;
  bodySize: number;
}

export interface ThemeLayout {
  productsPerRow: number
  spacing: number
}

export type ButtonStyle = "square" | "rounded" | "pill"

export interface HeaderConfig {
  logoText: string
  layout: string
  showAnnouncement: boolean
  announcementText: string
  navigationItems: string[]
  showSearchBar: boolean
  showWishlistIcon: boolean
}

export interface Section {
  id: string
  type: string
  name: string
  subtitle: string
  enabled: boolean
  expanded: boolean
  content: {
    heading?: string
    subheading?: string
    description?: string
    buttonText?: string
  }
}

export interface FooterColumnLinks {
  label: string
  url: string
}

export interface FooterColumn {
  title: string
  links: FooterColumnLinks[]
}

export interface FooterConfig {
  columns: number
  backgroundColor: string
  columnSettings: {
    column1: FooterColumn
    column2: FooterColumn
    column3: FooterColumn
    column4: FooterColumn
  }
  showNewsletter: boolean
  newsletterTitle: string
  newsletterDescription: string
  showSocialIcons: boolean
  socialLinks: {
    facebook: string
    instagram: string
    twitter: string
    linkedin: string
  }
  contactInfo: {
    email: string
    phone: string
    address: string
  }
  showPaymentIcons: boolean
  copyrightText: string
}

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

// Add this to your Theme types file
export interface ThemeLayout {
  productsPerRow: number;
  spacing: number;
  cardStyle: "minimal" | "ordered";
}

export type PageView = "home" | "cart" | "checkout" | "confirmOrder" | "productDetail" | "wishlist";
