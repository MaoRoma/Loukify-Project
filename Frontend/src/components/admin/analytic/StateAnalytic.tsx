"use client";

import type React from "react";

import { Card } from "@/components/ui/card";
import { DollarSign, Download, ShoppingBag, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportDialog } from "@/components/admin/analytic/ExportDialog";
import { useState } from "react";

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

  const analyticsData = {
    keyMetrics: {
      revenue: 12400,
      orders: 401,
      customers: 86,
    },
    salesOverview: [
      { month: "Jan", sales: 1200 },
      { month: "Feb", sales: 1900 },
      { month: "Mar", sales: 1700 },
      { month: "Apr", sales: 2200 },
      { month: "May", sales: 1800 },
      { month: "Jun", sales: 2500 },
    ],
    orderVolume: [
      { month: "Jan", orders: 45 },
      { month: "Feb", orders: 68 },
      { month: "Mar", orders: 59 },
      { month: "Apr", orders: 78 },
      { month: "May", orders: 63 },
      { month: "Jun", orders: 92 },
    ],
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
          value="4"
          label="Total Revenue"
          description="In Your Catelog"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <StateAnalytics
          value="2"
          label="Total Value"
          description="Total Orders"
          icon={<ShoppingBag className="w-6 h-6 text-orange-600" />}
        />
        <StateAnalytics
          value="1"
          label="Total Customer"
          description="Product categories"
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
