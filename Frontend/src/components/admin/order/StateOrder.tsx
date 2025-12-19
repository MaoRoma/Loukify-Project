 "use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Package } from "lucide-react";
import { api } from "@/lib/api/config";

interface StatCardProps {
  value: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  valueColor?: string;
}

function StateOrder({
  value,
  label,
  description,
  icon,
  valueColor = "text-foreground",
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-lg font-medium text-foreground">{label}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="space-y-2">
        <div className={`text-5xl font-bold ${valueColor}`}>{value}</div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </Card>
  );
}

export function OrderStats() {
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await api.orders.getSummary();
        const data = response?.data || {};

        setTotalOrders(data.totalOrders || 0);
      } catch (error) {
        console.error("Failed to fetch order statistics:", error);
        setTotalOrders(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and engage with your customer base
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        <StateOrder
          value={isLoading ? "..." : totalOrders}
          label="Total Orders"
          description="All time orders"
          icon={<Package className="w-6 h-6" />}
        />
      </div>
    </>
  );
}
