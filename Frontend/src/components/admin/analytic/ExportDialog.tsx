"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, FileText } from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analyticsData?: {
    keyMetrics: {
      revenue: number;
      orders: number;
      customers: number;
    };
    salesOverview: Array<{ month: string; sales: number }>;
    orderVolume: Array<{ month: string; orders: number }>;
  };
}

export function ExportDialog({
  open,
  onOpenChange,
  analyticsData,
}: ExportDialogProps) {
  const [selectedData, setSelectedData] = useState({
    keyMetrics: true,
    salesOverview: true,
    orderVolume: true,
  });

  const toggleDataSelection = (key: keyof typeof selectedData) => {
    setSelectedData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    const dataToExport = prepareExportData();
    exportAsPDF(dataToExport);
    onOpenChange(false);
  };

  const prepareExportData = () => {
    const data: any = {};

    if (selectedData.keyMetrics && analyticsData?.keyMetrics) {
      data.keyMetrics = analyticsData.keyMetrics;
    }
    if (selectedData.salesOverview && analyticsData?.salesOverview) {
      data.salesOverview = analyticsData.salesOverview;
    }
    if (selectedData.orderVolume && analyticsData?.orderVolume) {
      data.orderVolume = analyticsData.orderVolume;
    }

    return data;
  };

  const exportAsPDF = (data: any) => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Analytics Report</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #ffffff;
            padding: 60px 80px;
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .header {
            margin-bottom: 48px;
            padding-bottom: 24px;
            border-bottom: 2px solid #000;
          }
          
          h1 { 
            font-size: 36px;
            font-weight: 700;
            color: #000;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
          }
          
          .date {
            font-size: 14px;
            color: #666;
            font-weight: 400;
          }
          
          .section {
            margin-bottom: 48px;
          }
          
          h2 { 
            font-size: 20px;
            font-weight: 600;
            color: #000;
            margin-bottom: 24px;
            letter-spacing: -0.3px;
          }
          
          .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 24px; 
            margin-bottom: 16px;
          }
          
          .metric-card { 
            padding: 32px 24px;
            background: #fafafa;
            border-radius: 12px;
            border: 1px solid #e5e5e5;
          }
          
          .metric-value { 
            font-size: 40px;
            font-weight: 700;
            color: #000;
            margin-bottom: 8px;
            letter-spacing: -1px;
          }
          
          .metric-label { 
            font-size: 14px;
            color: #666;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          table { 
            width: 100%; 
            border-collapse: separate;
            border-spacing: 0;
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            overflow: hidden;
          }
          
          thead {
            background: #fafafa;
          }
          
          th { 
            padding: 16px 20px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e5e5e5;
          }
          
          td { 
            padding: 16px 20px;
            font-size: 15px;
            color: #1a1a1a;
            border-bottom: 1px solid #f0f0f0;
          }
          
          tbody tr:last-child td {
            border-bottom: none;
          }
          
          tbody tr:hover {
            background: #fafafa;
          }
          
          .footer {
            margin-top: 64px;
            padding-top: 24px;
            border-top: 1px solid #e5e5e5;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          
          @media print {
            body {
              padding: 40px;
            }
            
            .section {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Analytics Report</h1>
          <div class="date">${currentDate}</div>
        </div>
    `;

    if (data.keyMetrics) {
      htmlContent += `
        <div class="section">
          <h2>Key Metrics</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">$${data.keyMetrics.revenue.toLocaleString()}</div>
              <div class="metric-label">Total Revenue</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${data.keyMetrics.orders.toLocaleString()}</div>
              <div class="metric-label">Total Orders</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${data.keyMetrics.customers.toLocaleString()}</div>
              <div class="metric-label">New Customers</div>
            </div>
          </div>
        </div>
      `;
    }

    if (data.salesOverview) {
      htmlContent += `
        <div class="section">
          <h2>Sales Overview</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th style="text-align: right;">Sales Amount</th>
              </tr>
            </thead>
            <tbody>
      `;
      data.salesOverview.forEach((item: any) => {
        htmlContent += `
          <tr>
            <td>${item.month}</td>
            <td style="text-align: right; font-weight: 600;">$${item.sales.toLocaleString()}</td>
          </tr>
        `;
      });
      htmlContent += `
            </tbody>
          </table>
        </div>
      `;
    }

    if (data.orderVolume) {
      htmlContent += `
        <div class="section">
          <h2>Order Volume</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th style="text-align: right;">Order Count</th>
              </tr>
            </thead>
            <tbody>
      `;
      data.orderVolume.forEach((item: any) => {
        htmlContent += `
          <tr>
            <td>${item.month}</td>
            <td style="text-align: right; font-weight: 600;">${item.orders.toLocaleString()}</td>
          </tr>
        `;
      });
      htmlContent += `
            </tbody>
          </table>
        </div>
      `;
    }

    htmlContent += `
        <div class="footer">
          Analytics Report • Generated ${currentDate}
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const downloadFile = (
    content: string,
    filename: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6" />
              <DialogTitle className="text-2xl font-semibold">
                Export Analytics Data
              </DialogTitle>
            </div>
          </div>
          <p className="text-muted-foreground text-base mt-2">
            Select the data you want to export as PDF
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* PDF Export Info */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
            <FileText className="w-8 h-8 text-red-600 shrink-0" />
            <div>
              <div className="font-semibold text-base">Export as PDF Report</div>
              <div className="text-sm text-muted-foreground">
                Your analytics data will be exported as a professional formatted PDF document
              </div>
            </div>
          </div>

          {/* Select Data Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Select Data to Export
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="keyMetrics"
                  checked={selectedData.keyMetrics}
                  onCheckedChange={() => toggleDataSelection("keyMetrics")}
                />
                <Label
                  htmlFor="keyMetrics"
                  className="font-medium cursor-pointer"
                >
                  Key Metrics (Revenue, Orders, Customers)
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="salesOverview"
                  checked={selectedData.salesOverview}
                  onCheckedChange={() => toggleDataSelection("salesOverview")}
                />
                <Label
                  htmlFor="salesOverview"
                  className="font-medium cursor-pointer"
                >
                  Sales Overview (Monthly sales performance)
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="orderVolume"
                  checked={selectedData.orderVolume}
                  onCheckedChange={() => toggleDataSelection("orderVolume")}
                />
                <Label
                  htmlFor="orderVolume"
                  className="font-medium cursor-pointer"
                >
                  Order Volume (Monthly order count)
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
