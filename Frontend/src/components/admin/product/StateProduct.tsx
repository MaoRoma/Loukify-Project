"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DollarSign, Package, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { api } from "@/lib/api/config";

interface StatCardProps {
  value: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  valueColor?: string;
}

function StateProduct({
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

export function ProductStats() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    categoriesCount: 0,
    lowStockCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products and calculate statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await api.products.getAll();
        const products = response.data || [];

        // Calculate statistics
        const totalProducts = products.length;
        
        // Total value = sum of (price * stock) - but we don't have stock in current schema
        // So we'll use sum of prices for now
        const totalValue = products.reduce((sum: number, product: any) => {
          return sum + (parseFloat(product.product_price) || 0);
        }, 0);

        // Count distinct categories
        const categories = new Set(
          products
            .map((p: any) => p.product_category)
            .filter((cat: string) => cat && cat.trim() !== '')
        );
        const categoriesCount = categories.size;

        // Low stock count (products with status 'out_of_stock' or 'inactive')
        const lowStockCount = products.filter(
          (p: any) => p.product_status === 'out_of_stock' || p.product_status === 'inactive'
        ).length;

        setStats({
          totalProducts,
          totalValue,
          categoriesCount,
          lowStockCount,
        });
      } catch (error) {
        console.error("Failed to fetch product statistics:", error);
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
          <h1 className="text-3xl font-semibold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage and engage with your product catalog
          </p>
        </div>
        <div className="flex space-x-2">
          <a href="/admin/product/add-product">
            <Button>
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        <StateProduct
          value={isLoading ? "..." : stats.totalProducts}
          label="Total Products"
          description="In Your Catalog"
          icon={<Package className="w-6 h-6" />}
        />
        <StateProduct
          value={isLoading ? "..." : `$${stats.totalValue.toFixed(2)}`}
          label="Total Value"
          description="Inventory value"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <StateProduct
          value={isLoading ? "..." : stats.categoriesCount}
          label="Categories"
          description="Product categories"
          icon={<Package className="w-6 h-6 text-green-600" />}
        />
        <StateProduct
          value={isLoading ? "..." : stats.lowStockCount}
          label="Low Stock"
          description="Needs restocking"
          icon={<Package className="w-6 h-6 text-orange-600" />}
          valueColor="text-orange-600"
        />
      </div>
    </>
  );
}
