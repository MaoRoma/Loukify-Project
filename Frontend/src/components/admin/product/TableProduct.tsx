"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/config";

interface Product {
  id: string;
  product_name: string;
  product_category: string | null;
  product_price: number;
  product_status: string;
  product_image: string | null;
  product_description?: string | null;
}

interface ProductTableProps {
  searchQuery?: string;
}

export function ProductTable({ searchQuery = "" }: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.products.getAll();
        setProducts(response.data || []);
      } catch (err: any) {
        console.error("Failed to fetch products:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.product_name.toLowerCase().includes(query) ||
      (product.product_category && product.product_category.toLowerCase().includes(query)) ||
      product.product_price.toString().includes(query) ||
      product.product_status.toLowerCase().includes(query)
    );
  });

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      setIsSaving(true);
      const updateData = {
        product_name: editingProduct.product_name,
        product_category: editingProduct.product_category || undefined,
        product_price: editingProduct.product_price,
        product_status: editingProduct.product_status,
        product_description: editingProduct.product_description || undefined,
      };

      await api.products.update(editingProduct.id, updateData);
      
      // Refresh products list
      const response = await api.products.getAll();
      setProducts(response.data || []);
      
      setIsEditDialogOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      console.error("Failed to update product:", err);
      alert(err.message || "Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      setIsDeleting(true);
      await api.products.delete(deletingProduct.id);
      
      // Remove from local state
      setProducts(products.filter((p) => p.id !== deletingProduct.id));
      setIsDeleteDialogOpen(false);
      setDeletingProduct(null);
    } catch (err: any) {
      console.error("Failed to delete product:", err);
      alert(err.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  // Removed handleCopy function since we're removing the copy button

  return (
    <>
      <Card className="overflow-hidden flex">
        <div className="p-6 w-full">
          <h2 className="text-lg font-semibold mb-4">All Products</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading products...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        {searchQuery ? "No products found matching your search." : "No products yet."}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {product.product_image && (
                              <img 
                                src={product.product_image} 
                                alt={product.product_name}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium text-foreground">
                                {product.product_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {product.product_category || "Uncategorized"}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-foreground">
                            ${product.product_price.toFixed(2)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              product.product_status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {product.product_status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="border border-gray-400 h-8 w-8"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="border border-gray-400 text-red-500 h-8 w-8"
                              onClick={() => handleDeleteClick(product)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to the product details below.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="product">Product Name</Label>
                <Input
                  id="product"
                  value={editingProduct.product_name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      product_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={editingProduct.product_category || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      product_category: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={editingProduct.product_price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      product_price: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={editingProduct.product_status}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      product_status: e.target.value,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deletingProduct?.product_name}. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
