"use client";

import { Search, ShoppingCart, User, Heart, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type {
  ThemeColors,
  ThemeTypography,
  HeaderConfig,
} from "@/lib/types/Theme";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { getFontFamilyStyle } from "@/lib/utils/ThemeHelper";

// Mock product database for search
const mockProducts = [
  { id: 1, name: "Classic T-Shirt", category: "Clothing", price: 29.99, image: "/image/product1.jpg", rating: 4.5, stock: 50 },
  { id: 2, name: "Denim Jeans", category: "Clothing", price: 79.99, image: "/image/product2.jpg", rating: 4.8, stock: 30 },
  { id: 3, name: "Running Sneakers", category: "Footwear", price: 89.99, image: "/image/product3.jpg", rating: 4.6, stock: 25 },
  { id: 4, name: "Cotton Hoodie", category: "Clothing", price: 59.99, image: "/image/product4.jpg", rating: 4.7, stock: 40 },
  { id: 5, name: "Leather Wallet", category: "Accessories", price: 39.99, image: "/image/product1.jpg", rating: 4.4, stock: 60 },
  { id: 6, name: "Sports Cap", category: "Accessories", price: 24.99, image: "/image/product2.jpg", rating: 4.3, stock: 45 },
  { id: 7, name: "Winter Jacket", category: "Clothing", price: 129.99, image: "/image/product3.jpg", rating: 4.9, stock: 15 },
  { id: 8, name: "Canvas Backpack", category: "Accessories", price: 49.99, image: "/image/product4.jpg", rating: 4.5, stock: 35 },
];

interface PreviewHeaderProps {
  colors: ThemeColors;
  typography: ThemeTypography;
  header: HeaderConfig;
  onCartClick: () => void;
  onWishlistClick?: () => void;
  onProductClick?: (product: any) => void;
}

export function PreviewHeader({
  colors,
  typography,
  header,
  onCartClick,
  onWishlistClick,
  onProductClick,
}: PreviewHeaderProps) {
  const { cartItemCount, addToCart } = useCart();
  const { wishlistCount } = useWishlist();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter products based on search query
  const filteredProducts = searchQuery.trim()
    ? mockProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
        setSearchQuery("");
      }
    }

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: string) => {
    e.preventDefault();
    const sectionId = item.toLowerCase().replace(/\s+/g, '-');
    const element = document.getElementById(sectionId);
    
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    setSearchQuery("");
  };

  const handleProductClick = (product: any) => {
    if (onProductClick) {
      onProductClick(product);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      {header.showAnnouncement && (
        <div
          className="px-6 py-2 text-center text-sm"
          style={{
            backgroundColor: colors.primary,
            color: colors.background,
            fontFamily: getFontFamilyStyle(typography.bodyFont),
          }}
        >
          {header.announcementText}
        </div>
      )}

      {/* Navigation */}
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <div
          className="font-bold text-xl"
          style={{
            color: colors.text,
            fontFamily: getFontFamilyStyle(typography.headingFont),
          }}
        >
          {header.logoText}
        </div>
        <div className="flex items-center gap-6">
          <nav
            className="hidden md:flex items-center gap-6 text-sm"
            style={{
              fontSize: `${typography.bodySize}px`,
              fontFamily: getFontFamilyStyle(typography.bodyFont),
            }}
          >
            {header.navigationItems.map((item, index) => (
              <a 
                key={index} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={(e) => handleNavClick(e, item)}
                style={{ color: colors.text }}
                className="hover:opacity-70 transition-opacity cursor-pointer"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4 relative">
            {/* Inline Search */}
            {header.showSearchBar && (
              <div ref={searchRef} className="relative">
                {!showSearch ? (
                  <button
                    onClick={handleSearchToggle}
                    className="hover:opacity-70 transition-opacity"
                    aria-label="Search"
                  >
                    <Search
                      className="w-5 h-5"
                      style={{ color: colors.text }}
                    />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        autoFocus
                        className="w-64 px-4 py-2 pr-10 rounded-md border focus:outline-none focus:ring-2"
                        style={{
                          borderColor: colors.text + "30",
                          color: colors.text,
                          backgroundColor: colors.background,
                          fontFamily: getFontFamilyStyle(typography.bodyFont),
                        }}
                      />
                      <Search
                        className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-50"
                        style={{ color: colors.text }}
                      />
                    </div>
                    <button
                      onClick={handleSearchToggle}
                      className="hover:opacity-70 transition-opacity"
                      aria-label="Close search"
                    >
                      <X
                        className="w-5 h-5"
                        style={{ color: colors.text }}
                      />
                    </button>
                  </div>
                )}

                {/* Search Results Dropdown */}
                {showSearch && searchQuery.trim() && (
                  <div
                    className="absolute top-full right-0 mt-2 w-96 max-h-96 overflow-y-auto rounded-lg shadow-2xl border z-50"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.text + "20",
                    }}
                  >
                    {filteredProducts.length > 0 ? (
                      <div className="p-2">
                        <div
                          className="px-3 py-2 text-sm font-semibold border-b"
                          style={{
                            color: colors.text,
                            borderColor: colors.text + "20",
                            fontFamily: getFontFamilyStyle(typography.bodyFont),
                          }}
                        >
                          Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
                        </div>
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-opacity-50 transition-colors rounded-md"
                            style={{
                              backgroundColor: "transparent",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = colors.primary + "10";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            <div
                              className="w-12 h-12 rounded-md bg-cover bg-center shrink-0"
                              style={{
                                backgroundImage: `url(${product.image})`,
                                backgroundColor: colors.text + "10",
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div
                                className="font-medium truncate"
                                style={{
                                  color: colors.text,
                                  fontFamily: getFontFamilyStyle(typography.bodyFont),
                                }}
                              >
                                {product.name}
                              </div>
                              <div
                                className="text-sm opacity-60"
                                style={{ color: colors.text }}
                              >
                                {product.category}
                              </div>
                            </div>
                            <div
                              className="font-semibold"
                              style={{
                                color: colors.primary,
                                fontFamily: getFontFamilyStyle(typography.bodyFont),
                              }}
                            >
                              ${product.price.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Search
                          className="w-12 h-12 mx-auto mb-3 opacity-30"
                          style={{ color: colors.text }}
                        />
                        <div
                          className="font-medium mb-1"
                          style={{
                            color: colors.text,
                            fontFamily: getFontFamilyStyle(typography.bodyFont),
                          }}
                        >
                          No results found
                        </div>
                        <div
                          className="text-sm opacity-60"
                          style={{ color: colors.text }}
                        >
                          Try searching for something else
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Icon */}
            {header.showWishlistIcon && (
              <button
                onClick={onWishlistClick}
                className="relative hover:opacity-70 transition-opacity"
                aria-label="View wishlist"
              >
                <Heart
                  className="w-5 h-5"
                  style={{ color: colors.text }}
                />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.background,
                    }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Icon */}
            <button
              onClick={onCartClick}
              className="relative hover:opacity-70 transition-opacity"
              aria-label="View cart"
            >
              <ShoppingCart
                className="w-5 h-5"
                style={{ color: colors.text }}
              />
              {cartItemCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                  }}
                >
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
