"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Profile", href: "/admin/setting/profile" },
  { id: "store", label: "Store", href: "/admin/setting/store" },
  { id: "security", label: "Security", href: "/admin/setting/security" },
];

export function SettingTab() {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your store and account preferences
        </p>
      </div>
      <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 bg-[#e8e8e8] p-1 sm:p-1.5 rounded-full w-full ">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex-1 px-4 sm:px-6 py-1 sm:py-1.5 rounded-full text-sm sm:text-base font-medium transition-all whitespace-nowrap text-center",
              pathname === tab.href
                ? "bg-white text-[#2a2a2a] shadow-sm"
                : "bg-transparent text-[#6a6a6a] hover:text-[#2a2a2a] hover:bg-[#f2f2f2]"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </>
  );
}
