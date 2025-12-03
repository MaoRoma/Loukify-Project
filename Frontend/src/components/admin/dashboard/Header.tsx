"use client";

import { Search, Bell, Package, ShoppingCart, User, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: "product" | "order" | "customer" | "page";
  link: string;
  priority: number;
}

// Mock data - In production, this would come from your API/database
const allData = {
  products: [
    { id: "1", name: "Product 1", category: "Category 1", price: "$217.50", stock: "32" },
    { id: "2", name: "Product 2", category: "Category 2", price: "$85.00", stock: "32" },
    { id: "3", name: "Product 3", category: "Category 3", price: "$425.00", stock: "32" },
    { id: "4", name: "Product 4", category: "Category 4", price: "$32.00", stock: "32" },
  ],
  orders: [
    { id: "#ORD-001", customer: "sophea@example.com", status: "Pending", total: "$217.50" },
    { id: "#ORD-002", customer: "virak@example.com", status: "Pending", total: "$85.00" },
    { id: "#ORD-003", customer: "channary@example.com", status: "Completed", total: "$425.00" },
    { id: "#ORD-004", customer: "dara@example.com", status: "Completed", total: "$32.00" },
  ],
  customers: [
    { id: "1", name: "Sophea Chen", email: "sophea@example.com", location: "Phnom Penh" },
    { id: "2", name: "Virak Phan", email: "virak@example.com", location: "Siem Reap" },
    { id: "3", name: "Channary Lim", email: "channary@example.com", location: "Battambang" },
    { id: "4", name: "Dara Sok", email: "dara@example.com", location: "Phnom Penh" },
  ],
  pages: [
    { name: "Dashboard", link: "/admin/dashboard", keywords: ["home", "overview", "stats"] },
    { name: "Products", link: "/admin/product", keywords: ["inventory", "items", "catalog"] },
    { name: "Orders", link: "/admin/order", keywords: ["sales", "purchases", "transactions"] },
    { name: "Customers", link: "/admin/customer", keywords: ["users", "clients", "buyers"] },
    { name: "Analytics", link: "/admin/analytic", keywords: ["reports", "insights", "data"] },
    { name: "Online Store", link: "/admin/online-store", keywords: ["shop", "store", "website"] },
  ],
};

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search Products (Priority 1-3)
    allData.products.forEach((product) => {
      let priority = 10;
      const nameMatch = product.name.toLowerCase().includes(query);
      const categoryMatch = product.category.toLowerCase().includes(query);
      const priceMatch = product.price.toLowerCase().includes(query);

      if (nameMatch) priority = product.name.toLowerCase().startsWith(query) ? 1 : 2;
      else if (categoryMatch) priority = 3;
      else if (priceMatch) priority = 4;
      else return;

      results.push({
        id: `product-${product.id}`,
        title: product.name,
        subtitle: `${product.category} • ${product.price} • Stock: ${product.stock}`,
        category: "product",
        link: "/admin/product",
        priority,
      });
    });

    // Search Orders (Priority 2-4)
    allData.orders.forEach((order) => {
      let priority = 10;
      const idMatch = order.id.toLowerCase().includes(query);
      const customerMatch = order.customer.toLowerCase().includes(query);
      const statusMatch = order.status.toLowerCase().includes(query);

      if (idMatch) priority = order.id.toLowerCase().startsWith(query) ? 2 : 3;
      else if (customerMatch) priority = 4;
      else if (statusMatch) priority = 5;
      else return;

      results.push({
        id: `order-${order.id}`,
        title: order.id,
        subtitle: `${order.customer} • ${order.status} • ${order.total}`,
        category: "order",
        link: "/admin/order",
        priority,
      });
    });

    // Search Customers (Priority 3-5)
    allData.customers.forEach((customer) => {
      let priority = 10;
      const nameMatch = customer.name.toLowerCase().includes(query);
      const emailMatch = customer.email.toLowerCase().includes(query);
      const locationMatch = customer.location.toLowerCase().includes(query);

      if (nameMatch) priority = customer.name.toLowerCase().startsWith(query) ? 3 : 4;
      else if (emailMatch) priority = 5;
      else if (locationMatch) priority = 6;
      else return;

      results.push({
        id: `customer-${customer.id}`,
        title: customer.name,
        subtitle: `${customer.email} • ${customer.location}`,
        category: "customer",
        link: "/admin/customer",
        priority,
      });
    });

    // Search Pages (Priority 6-7)
    allData.pages.forEach((page) => {
      const nameMatch = page.name.toLowerCase().includes(query);
      const keywordMatch = page.keywords.some((keyword) => keyword.includes(query));

      if (nameMatch || keywordMatch) {
        results.push({
          id: `page-${page.name}`,
          title: page.name,
          subtitle: "Navigate to page",
          category: "page",
          link: page.link,
          priority: nameMatch ? 6 : 7,
        });
      }
    });

    // Sort by priority (lower number = higher priority)
    results.sort((a, b) => a.priority - b.priority);

    // Limit to top 10 results
    setSearchResults(results.slice(0, 10));
    setIsSearchOpen(results.length > 0);
  }, [searchQuery]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "product":
        return <Package className="w-4 h-4" />;
      case "order":
        return <ShoppingCart className="w-4 h-4" />;
      case "customer":
        return <User className="w-4 h-4" />;
      case "page":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "product":
        return "text-blue-600";
      case "order":
        return "text-green-600";
      case "customer":
        return "text-purple-600";
      case "page":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <header className="h-14 border-b border-border bg-linear-to-r from-[#292524] to-[#44403B] flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50">
      <Link href="/" className="text-2xl font-bold">
        <img
          src="/image/dashboardlogo.png"
          alt="Loukify Logo"
          className="inline-block w-8 h-8 mr-2"
        />
        <span className="text-card font-inter">Loukify</span>
      </Link>
      <div className="flex-1 max-w-xl relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, orders, customers..."
            className="pl-9 bg-muted border-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setIsSearchOpen(true)}
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchResults.length > 0 && (
          <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto shadow-lg z-50">
            <div className="p-2">
              <div className="text-xs text-muted-foreground px-3 py-2 font-medium">
                Search Results ({searchResults.length})
              </div>
              {searchResults.map((result) => (
                <Link
                  key={result.id}
                  href={result.link}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="flex items-start gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className={`mt-0.5 ${getCategoryColor(result.category)}`}>
                    {getCategoryIcon(result.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-foreground truncate">
                      {result.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {result.subtitle}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize shrink-0">
                    {result.category}
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-card relative">
          <Bell className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-card text-primary text-sm">
              A
            </AvatarFallback>
          </Avatar>
          <span className="text-card font-medium">sellerds</span>
        </div>
      </div>
    </header>
  );
}
