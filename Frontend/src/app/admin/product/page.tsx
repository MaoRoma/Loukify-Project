"use client";

import { ProductSearch } from "@/components/admin/product/SearchProduct";
import { ProductTable } from "@/components/admin/product/TableProduct";
import { ProductStats } from "@/components/admin/product/StateProduct";
import React, { useState } from "react";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <ProductStats />
      <ProductSearch onSearch={setSearchQuery} />
      <ProductTable searchQuery={searchQuery} />
    </>
  );
}
