"use client";

import {
  Label,
  PolarGrid,
  RadialBar,
  RadialBarChart,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

import { Label as LabelUi } from "./ui/label";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Info } from "lucide-react";

const chartConfig = {
  colorCountGreen: {
    color: "hsl(var(--chart-2))",
  },
  colorCountYellow: {
    color: "hsl(var(--chart-3))",
  },
  colorCountRed: {
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

interface RadialChartProps {
  title: string;
  count: number;
  tooltip: string;
}

export function RadialChart({ title, count, tooltip }: RadialChartProps) {
  const fillColor =
    count >= 70
      ? "var(--color-colorCountGreen)"
      : count >= 40
      ? "var(--color-colorCountYellow)"
      : "var(--color-colorCountRed)";

  const chartData = [{ count: count, fill: fillColor }];

  return (
    <div className="flex flex-col items-center justify-center">
      <ChartContainer
        config={chartConfig}
        className="mx-auto w-[250px] max-h-[250px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270 * (count / 100)}
            innerRadius="80%"
            outerRadius="110%"
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[55, 48]}
            />
            <RadialBar dataKey="count" background cornerRadius={10} />
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
                          className="fill-foreground text-xl font-bold"
                        >
                          {chartData[0].count.toLocaleString()}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="flex gap-1 items-center justify-center">
        <LabelUi>{title}</LabelUi>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger className="z-50">
              <Info className="size-3 text-gray-500" />
            </TooltipTrigger>
            <TooltipContent className="max-w-48">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
