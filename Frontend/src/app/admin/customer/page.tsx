"use client";

import { CustomerStats } from "@/components/admin/customer/StateCustomer";
import { CustomerSearch } from "@/components/admin/customer/SearchCustomer";
import { CustomerTable } from "@/components/admin/customer/TableCustomer";
import { useState } from "react";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <CustomerStats />
      <CustomerSearch onSearch={setSearchQuery} />
      <CustomerTable searchQuery={searchQuery} />
    </>
  );
}
