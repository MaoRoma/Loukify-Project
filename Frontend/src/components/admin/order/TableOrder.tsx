"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Printer } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api/config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderItem {
  product_id?: string | null;
  product_name?: string | null;
  product_sku?: string | null;
  quantity: number;
  price: number;
  total?: number;
}

interface Order {
  id: string;
  order_id: string;
  customer_id: string;
  total_price: number;
  date: string;
  order_items: OrderItem[];
  customer?: {
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
  };
}


interface OrderTableProps {
  searchQuery?: string;
  sortByPriority?: boolean;
}

export function OrderTable({ searchQuery = "", sortByPriority = false }: OrderTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getOrderItemTotal = (item: OrderItem) => {
    const providedTotal = typeof item.total === "number" ? item.total : undefined;
    if (typeof providedTotal === "number" && !Number.isNaN(providedTotal)) {
      return providedTotal;
    }

    const quantity = Number.isFinite(item.quantity) ? Number(item.quantity) : 0;
    const price = Number.isFinite(item.price) ? Number(item.price) : 0;
    const fallbackTotal = quantity * price;
    return Number.isFinite(fallbackTotal) ? fallbackTotal : 0;
  };

  // Fetch orders and customers from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch orders
        const ordersResponse = await api.orders.getAll();
        const ordersData = (ordersResponse.data || []).map((order: any) => ({
          ...order,
          order_items: Array.isArray(order.order_items) ? order.order_items : [],
        }));
        
        // Fetch customers to enrich order data
        const customersResponse = await api.customers.getAll();
        const customersMap = new Map(
          (customersResponse.data || []).map((c: any) => [c.customer_id, c])
        );
        
        // Enrich orders with customer data
        const enrichedOrders = ordersData.map((order: any) => ({
          ...order,
          customer: order.customer || customersMap.get(order.customer_id),
        }));
        
        setOrders(enrichedOrders);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err);
        setError(err.message || "Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search query
  let filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.order_id.toLowerCase().includes(query) ||
      (order.customer?.customer_email && order.customer.customer_email.toLowerCase().includes(query)) ||
      order.customer_id.toLowerCase().includes(query) ||
      (order.customer?.customer_phone && order.customer.customer_phone.toLowerCase().includes(query))
    );
  });

  // Sort by priority if filter is active
  if (sortByPriority) {
    filteredOrders = [...filteredOrders].sort((a, b) => {
      // Sort by date (oldest first - FIFO)
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Note: Current API doesn't have status field, so this is a placeholder
      // You may need to add status to the orders table schema
      await api.orders.update(orderId, { status: newStatus });
      
      // Refresh orders
      const response = await api.orders.getAll();
      setOrders(response.data || []);
    } catch (err: any) {
      console.error("Failed to update order status:", err);
      alert(err.message || "Failed to update order status");
    }
  };

  const handlePrintReceipt = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsRows = order.order_items
      .map(
        (item) => `
          <tr>
            <td>${item.product_name || "Item"}</td>
            <td class="text-center">${item.product_sku || "-"}</td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-right">$${(item.price || 0).toFixed(2)}</td>
            <td class="text-right">$${getOrderItemTotal(item).toFixed(2)}</td>
          </tr>
        `
      )
      .join("") || `<tr><td colspan="5">No line items provided</td></tr>`;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${order.order_id}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Courier New', monospace;
              padding: 20px;
              max-width: 400px;
              margin: 0 auto;
            }
            .receipt {
              border: 2px solid #000;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 15px;
              margin-bottom: 15px;
            }
            .store-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .store-info {
              font-size: 12px;
              line-height: 1.5;
            }
            .section {
              margin-bottom: 15px;
              padding-bottom: 15px;
              border-bottom: 1px dashed #000;
            }
            .section:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              display: inline-block;
              width: 120px;
            }
            .items-table {
              width: 100%;
              margin-top: 10px;
            }
            .items-table th {
              text-align: left;
              border-bottom: 1px solid #000;
              padding: 5px 0;
              font-size: 12px;
            }
            .items-table td {
              padding: 8px 0;
              font-size: 12px;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
            .total-section {
              margin-top: 15px;
              padding-top: 15px;
              border-top: 2px solid #000;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-size: 18px;
              font-weight: bold;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
            }
            @media print {
              body {
                padding: 0;
              }
              .receipt {
                border: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="store-name">YOUR STORE</div>
              <div class="store-info">
                123 Business Street<br>
                City, State 12345<br>
                Tel: +855 12 345 678<br>
                Email: store@example.com
              </div>
            </div>

            <div class="section">
              <div><span class="label">Order ID:</span> ${order.order_id}</div>
              <div><span class="label">Customer ID:</span> ${
                order.customer_id.substring(0, 8)
              }</div>
              <div><span class="label">Date:</span> ${new Date(order.date).toLocaleDateString()}</div>
            </div>

            <div class="section">
              <div style="font-weight: bold; margin-bottom: 8px;">CUSTOMER INFORMATION</div>
              <div><span class="label">Name:</span> ${order.customer?.customer_name || 'N/A'}</div>
              <div><span class="label">Email:</span> ${order.customer?.customer_email || 'N/A'}</div>
              <div><span class="label">Phone:</span> ${order.customer?.customer_phone || 'N/A'}</div>
            </div>

            <div class="section">
              <div style="font-weight: bold; margin-bottom: 8px;">ITEMS</div>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th class="text-center">SKU</th>
                    <th class="text-center">Qty</th>
                    <th class="text-right">Price</th>
                    <th class="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </div>

            <div class="total-section">
              <div class="total-row">
                <span>TOTAL:</span>
                <span>$${order.total_price.toFixed(2)}</span>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for your purchase!</p>
              <p>Please come again</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  return (
    <>
      <Card className="overflow-hidden flex">
        <div className="p-6 w-full">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading orders...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Customer ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        {searchQuery ? "No orders found matching your search." : "No orders yet."}
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium text-foreground">
                            {order.order_id}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="font-medium text-foreground">
                              #{order.customer_id.substring(0, 8)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.customer?.customer_email || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-foreground">
                            ${order.total_price.toFixed(2)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="border border-gray-400 h-8 w-8"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="border border-gray-400 h-8 w-8"
                              onClick={() => handlePrintReceipt(order)}
                            >
                              <Printer className="w-4 h-4" />
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.order_id}</DialogTitle>
            <DialogDescription>
              View complete order information
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="text-sm font-medium">
                      {selectedOrder.order_id}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Customer ID</p>
                    <p className="text-sm font-medium">
                      #{selectedOrder.customer_id.substring(0, 8)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                    <p className="text-sm font-medium">
                      {selectedOrder.customer?.customer_name || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">
                      {selectedOrder.customer?.customer_email || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">
                      {selectedOrder.customer?.customer_phone || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="text-sm font-medium">
                      {new Date(selectedOrder.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Total */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Order Total
                </h3>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold">
                      ${selectedOrder.total_price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Order Items
                </h3>
                <div className="border rounded-lg">
                  {selectedOrder.order_items.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">
                      No items recorded for this order.
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3">Product</th>
                          <th className="text-left py-2 px-3">SKU</th>
                          <th className="text-center py-2 px-3">Qty</th>
                          <th className="text-right py-2 px-3">Price</th>
                          <th className="text-right py-2 px-3">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.order_items.map((item, index) => (
                          <tr key={`${item.product_id || item.product_name || index}-${index}`} className="border-b border-border last:border-0">
                            <td className="py-2 px-3">{item.product_name || "Item"}</td>
                            <td className="py-2 px-3 text-muted-foreground">{item.product_sku || "-"}</td>
                            <td className="py-2 px-3 text-center">{item.quantity}</td>
                            <td className="py-2 px-3 text-right">${(item.price || 0).toFixed(2)}</td>
                            <td className="py-2 px-3 text-right">${getOrderItemTotal(item).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
