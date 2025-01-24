"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type InventoryGraphProps = {
  tournament: {
    startDate: string;
    endDate: string;
  };
};

// Simulerade inventeringar
const inventories = [
  { id: 1, date: "2025-07-10" },
  { id: 2, date: "2025-07-10" },
  { id: 3, date: "2025-07-11" },
  { id: 4, date: "2025-07-12" },
  { id: 5, date: "2025-07-12" },
  { id: 6, date: "2025-07-12" },
  { id: 7, date: "2025-07-12" },
  { id: 8, date: "2025-07-12" },
  { id: 9, date: "2025-07-12" },
  { id: 10, date: "2025-07-12" },
  { id: 11, date: "2025-07-12" },
  { id: 12, date: "2025-07-12" },
  { id: 12, date: "2025-07-12" },
  { id: 14, date: "2025-07-12" },
  { id: 15, date: "2025-07-12" },
  { id: 6, date: "2025-07-12" },
  { id: 6, date: "2025-03-05" },
  { id: 6, date: "2025-03-05" },
  { id: 6, date: "2025-03-05" },
  { id: 6, date: "2025-03-07" },
];

export function InventoryGraph({ tournament }: InventoryGraphProps) {
  if (!tournament) {
    return <div>Laddar turneringsdata...</div>;
  }

  const getInventoryGraphData = () => {
    const start = new Date(tournament.startDate);
    const end = new Date(tournament.endDate);
    const days = [];

    while (start <= end) {
      days.push(new Date(start).toISOString().split("T")[0]); // Format YYYY-MM-DD
      start.setDate(start.getDate() + 1);
    }

    // Räkna inventeringar per dag
    return days.map((day) => ({
      date: new Date(day).toLocaleDateString("sv-SE", {
        month: "short",
        day: "numeric",
      }),
      count: inventories.filter((inventory) => inventory.date === day).length,
    }));
  };

  const chartData = getInventoryGraphData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventeringar per dag</CardTitle>
      </CardHeader>
      <CardContent>
        <div className=" rounded-lg shadow-lg">
          <ResponsiveContainer width="100%" height={290}>
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="colorLine" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  border: "none",
                }}
                labelStyle={{ color: "#6b7280", fontWeight: "bold" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#FF8C00"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#fffffff",
                  strokeWidth: 2,
                  stroke: "#ffffff",
                }}
                activeDot={{
                  r: 6,
                  fill: "#FF8C00",
                  strokeWidth: 2,
                  stroke: "#ffffff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Totalt {inventories.length} inventeringar{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Visar antal inventeringar per dag under turneringsperioden.
        </div>
      </CardFooter>
    </Card>
  );
}
