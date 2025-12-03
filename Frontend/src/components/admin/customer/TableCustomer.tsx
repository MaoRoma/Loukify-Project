"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { api } from "@/lib/api/config";

interface Customer {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_location: string | null;
}

interface CustomerTableProps {
  searchQuery?: string;
}

export function CustomerTable({ searchQuery = "" }: CustomerTableProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.customers.getAll();
        setCustomers(response.data || []);
      } catch (err: any) {
        console.error("Failed to fetch customers:", err);
        setError(err.message || "Failed to load customers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.customer_name.toLowerCase().includes(query) ||
      customer.customer_email.toLowerCase().includes(query) ||
      (customer.customer_phone && customer.customer_phone.toLowerCase().includes(query)) ||
      (customer.customer_location && customer.customer_location.toLowerCase().includes(query))
    );
  });

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Customer Directory</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading customers...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Customer ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Phone Number
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      {searchQuery ? "No customers found matching your search." : "No customers yet."}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.customer_id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-foreground">
                          #{customer.customer_id.substring(0, 8)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-foreground">
                          {customer.customer_name}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {customer.customer_email}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {customer.customer_phone || "N/A"}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {customer.customer_location || "N/A"}
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
  );
}
