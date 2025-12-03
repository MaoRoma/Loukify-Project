"use client";

import type React from "react";
import Link from "next/link";
import { useState } from "react";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  Store,
  Plus,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Home", icon: Home, href: "/admin/dashboard" },
  { label: "Product", icon: Package, href: "/admin/product" },
  { label: "Orders", icon: ShoppingCart, href: "/admin/order" },
  { label: "Customers", icon: Users, href: "/admin/customer" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytic" },
  { label: "Settings", icon: Settings, href: "/admin/setting/profile" },
];

const salesChannels: NavItem[] = [
  {
    label: "Online Store",
    icon: Store,
    href: "/admin/online-store",
  },
];

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "Online Store",
  ]);
  const pathname = usePathname();

  const toggleItem = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <aside className="fixed left-0 top-14 w-60 bg-white text-gray-900 flex flex-col h-[calc(100vh-3.5rem)] border-r border-gray-200 z-40">
      <nav className="flex-1 overflow-y-auto px-3 pt-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleItem(item.label)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      pathname === item.href
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedItems.includes(item.label) && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedItems.includes(item.label) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    pathname === item.href
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Sales Channels
          </div>
          <div className="space-y-1">
            {salesChannels.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href!}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    pathname === item.href
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
                {expandedItems.includes(item.label) && item.children && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-3 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help & Support</span>
        </Button>
      </div>
    </aside>
  );
}
