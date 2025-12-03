"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart";

const chartData = [
  { month: "January", orders: 45 },
  { month: "February", orders: 68 },
  { month: "March", orders: 58 },
  { month: "April", orders: 78 },
  { month: "May", orders: 63 },
  { month: "June", orders: 92 },
];

const chartConfig = {
  orders: {
    label: "Orders",
    color: "#000000",
  },
} satisfies ChartConfig;

export function OrderVolume() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Volume</CardTitle>
        <CardDescription>Monthly order count</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid
              vertical={true}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              tick={{ fill: "#6b7280" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="orders" fill="#000000" radius={0} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
