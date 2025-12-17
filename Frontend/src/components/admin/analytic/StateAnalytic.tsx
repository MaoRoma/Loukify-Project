"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { DollarSign, Download, ShoppingBag, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportDialog } from "@/components/admin/analytic/ExportDialog";
import { api } from "@/lib/api/config";

interface StatCardProps {
  value: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  valueColor?: string;
}

function StateAnalytics({
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

export function StateAnalytic() {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [revenue, setRevenue] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const [ordersSummary, customersSummary] = await Promise.all([
          api.orders.getSummary(),
          api.customers.getSummary(),
        ]);

        const ordersData = ordersSummary?.data || {};
        const customersData = customersSummary?.data || {};

        setTotalOrders(ordersData.totalOrders || 0);
        setRevenue(ordersData.totalRevenue || 0);
        setTotalCustomers(customersData.totalCustomers || 0);
      } catch (error) {
        console.error("Failed to fetch analytics summary:", error);
        setRevenue(0);
        setTotalOrders(0);
        setTotalCustomers(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const analyticsData = {
    keyMetrics: {
      revenue,
      orders: totalOrders,
      customers: totalCustomers,
    },
    // Charts can be wired to real data later; keep demo data or empty arrays for now
    salesOverview: [],
    orderVolume: [],
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Track your store's performance and growth
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            className="bg-background text-foreground border border-border hover:bg-accent"
            onClick={() => setExportDialogOpen(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StateAnalytics
          value={isLoading ? "..." : `$${revenue.toFixed(2)}`}
          label="Total Revenue"
          description="All time revenue"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <StateAnalytics
          value={isLoading ? "..." : totalOrders}
          label="Total Orders"
          description="All time orders"
          icon={<ShoppingBag className="w-6 h-6 text-orange-600" />}
        />
        <StateAnalytics
          value={isLoading ? "..." : totalCustomers}
          label="Total Customers"
          description="All time customers"
          icon={<UserRound className="w-6 h-6 text-green-600" />}
        />
      </div>
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        analyticsData={analyticsData}
      />
    </>
  );
}
