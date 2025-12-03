"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api/config";

export function AddProductForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "general",
    status: "in-stock",
    sku: "",
    barcode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate required fields
    if (!formData.name || !formData.price) {
      setError("Product name and price are required");
      setIsLoading(false);
      return;
    }

    try {
      // Map form data to API format
      const productData = {
        product_name: formData.name,
        product_description: formData.description || undefined,
        product_price: parseFloat(formData.price),
        product_category: formData.category || undefined,
        product_status: formData.status === "in-stock" ? "active" : "inactive",
        product_image: "", // TODO: Add image upload functionality
      };

      // Call API to create product
      await api.products.create(productData);

      // Success - navigate back to products page
      router.push("/admin/product");
    } catch (err: any) {
      console.error("Failed to create product:", err);
      setError(err.message || "Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 flex flex-col items-center justify-center bg-background hover:bg-muted/5 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Product Name
          </Label>
          <Input
            id="name"
            placeholder="Product name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your product"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="min-h-[100px] resize-none bg-muted/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium">
            Price
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              $
            </span>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="pl-7 bg-muted/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Stock Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="Select stock status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="bg-transparent"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Add Product"}
          </Button>
        </div>
      </form>
    </>
  );
}
