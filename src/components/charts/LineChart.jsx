"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function Component({ marks }) {
  function getPercent(n1, n2) {
    if (n1 === undefined || n2 === undefined) return 0;
    return (n1 / n2) * 100;
  }

  const chartData = [
    {
      test: "1",
      mark: getPercent(marks[0]?.studentMark, marks[0]?.maxMark),
    },
    {
      test: "2",
      mark: getPercent(marks[1]?.studentMark, marks[1]?.maxMark),
    },
    {
      test: "3",
      mark: getPercent(marks[2]?.studentMark, marks[2]?.maxMark),
    },
    {
      test: "4",
      mark: getPercent(marks[3]?.studentMark, marks[3]?.maxMark),
    },
    {
      test: "5",
      mark: getPercent(marks[4]?.studentMark, marks[4]?.maxMark),
    },
    {
      test: "6",
      mark: getPercent(marks[5]?.studentMark, marks[5]?.maxMark),
    },
    {
      test: "7",
      mark: getPercent(marks[6]?.studentMark, marks[6]?.maxMark),
    },
    {
      test: "8",
      mark: getPercent(marks[7]?.studentMark, marks[7]?.maxMark),
    },
  ];

  const chartConfig = {
    mark: {
      label: "درجة الإمتحان",
      color: "hsl(var(--chart-3))",
    },
  };
  return (
    <Card className="w-full lg:w-2/3">
      <CardHeader>
        <CardTitle>درجات الطالب في جميع الإمتحانات التي تم تأديتها.</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full h-[300px]"
        >
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={true} className="stroke-border" />
            <YAxis
              dataKey="mark"
              tickLine={false}
              axisLine={false}
              tickMargin={30}
              tickFormatter={(value) => value + "%"}
              domain={[0, 100]}
            />
            <XAxis
              dataKey="test"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="mark"
              type="monotone"
              fill="var(--color-mark)"
              fillOpacity={0.4}
              stroke="var(--color-mark)"
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
