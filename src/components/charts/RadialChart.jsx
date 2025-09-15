"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

export default function Component({ marks }) {
  const totalMark =
    marks.length > 0
      ? +(
          (marks.reduce((total, mark) => total + mark.studentMark, 0) /
            marks.reduce((total, mark) => total + mark.maxMark, 0)) *
          100
        ).toFixed(2)
      : 0;

  const chartData = [{ visitors: totalMark, fill: "var(--color-student)" }];

  const chartConfig = {
    visitors: {
      label: "مستوى الطالب",
    },
    student: {
      label: "student",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card className="flex flex-col w-full lg:w-1/3">
      <CardHeader className="items-center pb-0">
        <CardTitle>المستوي الكلي للطالب</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 relative">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] mt-12 lg:mt-24"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={totalMark * (360 / 100)}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].visitors}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          مستوى الطالب
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
