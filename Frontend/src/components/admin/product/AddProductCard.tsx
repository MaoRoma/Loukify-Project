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
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "general",
    status: "in-stock",
    sku: "",
    barcode: "",
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file");
        return;
      }
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be less than 10MB");
        return;
      }
      setSelectedImage(file);
      setError(null);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (): Promise<string | null> => {
    if (!selectedImage) return null;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      // Get auth token
      const { supabase } = await import('@/lib/supabase/client');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('Not authenticated');
      }

      // Upload image
      const response = await fetch('/api/storage/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || `Upload failed with status ${response.status}`;
        console.error('Upload error response:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorMessage);
      }

      const result = await response.json();
      if (!result.success || !result.data?.publicUrl) {
        throw new Error('Upload succeeded but no URL returned');
      }
      return result.data.publicUrl;
    } catch (err: any) {
      console.error('Image upload error:', err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

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
      // Upload image first if selected
      let imageUrl = "";
      if (selectedImage) {
        imageUrl = await handleImageUpload() || "";
      }

      // Map form data to API format
      const productData = {
        product_name: formData.name,
        product_description: formData.description || undefined,
        product_price: parseFloat(formData.price),
        product_category: formData.category || undefined,
        product_status: formData.status === "in-stock" ? "active" : "inactive",
        product_image: imageUrl,
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
        <div className="space-y-2">
          <Label htmlFor="image" className="text-sm font-medium">
            Product Image
          </Label>
          <label
            htmlFor="image"
            className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 flex flex-col items-center justify-center bg-background hover:bg-muted/5 transition-colors cursor-pointer"
          >
            {imagePreview ? (
              <div className="relative w-full">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedImage(null);
                    setImagePreview(null);
                    setUploadedImageUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
              </>
            )}
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
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
            disabled={isLoading || isUploading}
          >
            {isUploading ? "Uploading Image..." : isLoading ? "Creating..." : "Add Product"}
          </Button>
        </div>
      </form>
    </>
  );
}
