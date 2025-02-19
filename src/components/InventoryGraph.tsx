import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OverviewRecord } from "@/interfaces/overview";

type InventoryGraphProps = {
  tournament: {
    startDate: string;
    endDate: string;
  };
  overviewRecord: OverviewRecord;
};

export function InventoryGraph({
  tournament,
  overviewRecord,
}: InventoryGraphProps) {
  if (!tournament) {
    return <div>Laddar turneringsdata...</div>;
  }

  const getInventoryGraphData = () => {
    const start = new Date(tournament.startDate);
    const end = new Date(tournament.endDate);
    const days = [];

    const currentDate = new Date(
      Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
    );
    const endDate = new Date(
      Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
    );

    while (currentDate <= endDate) {
      days.push(currentDate.toISOString().split("T")[0]);
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return days.map((day) => ({
      date: new Date(day).toLocaleDateString("sv-SE", {
        month: "short",
        day: "numeric",
      }),
      count: overviewRecord[day]?.length ?? 0,
    }));
  };

  console.log(overviewRecord);
  console.log(overviewRecord["2025-02-06"] ?? 0);

  const chartData = getInventoryGraphData();

  return (
    <Card className="dark:bg-slate-900 ">
      <CardHeader>
        <CardTitle className="dark:text-gray-200">Inventeringar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg  flex justify-center items-center">
          <ResponsiveContainer width="100%" height={290}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 20,
              }}
            >
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
                cursor={false}
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  border: "none",
                }}
                labelStyle={{ color: "#6b7280", fontWeight: "bold" }}
              />
              <Bar
                dataKey="count"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
                barSize={100}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Visar antal inventeringar per dag under turneringsperioden.
        </div>
      </CardFooter>
    </Card>
  );
}
