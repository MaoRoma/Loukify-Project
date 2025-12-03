"use client";

import { OrderStats } from "@/components/admin/order/StateOrder";
import { OrderSearch } from "@/components/admin/order/SearchOrder";
import { OrderTable } from "@/components/admin/order/TableOrder";
import { useState } from "react";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  const handleFilter = () => {
    setIsFiltered(!isFiltered);
  };

  return (
    <>
      <OrderStats />
      <OrderSearch 
        onSearch={setSearchQuery} 
        onFilter={handleFilter}
        isFiltered={isFiltered}
      />
      <OrderTable 
        searchQuery={searchQuery} 
        sortByPriority={isFiltered}
      />
    </>
  );
}
