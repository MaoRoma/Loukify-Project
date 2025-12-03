"use client";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

export const description = "A line chart with dots";

const chartData = [
  { month: "January", sales: 1200 },
  { month: "February", sales: 1900 },
  { month: "March", sales: 1700 },
  { month: "April", sales: 2200 },
  { month: "May", sales: 1800 },
  { month: "June", sales: 2500 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#000000",
  },
} satisfies ChartConfig;

export function SaleOverview() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly sales performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid
              vertical={true}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              tick={{ fill: "#6b7280" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="sales"
              type="monotone"
              stroke="#000000"
              strokeWidth={2.5}
              dot={{
                fill: "#000000",
                strokeWidth: 0,
                r: 5,
              }}
              activeDot={{
                r: 7,
                fill: "#000000",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
