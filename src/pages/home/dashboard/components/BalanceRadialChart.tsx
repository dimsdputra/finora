import React, { useCallback } from "react";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "../../../../components/ui/Chart";
import { getCurrentMonth } from "../../../../helpers/locationHelpers";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import classNames from "classnames";
import { FormatCurrency } from "../../../../helpers/currencyHelper";
import { useLocationStore } from "../../../../store/authStore";
import { useGetTotalYearBalances } from "../../../../api/monthlyBalances.api";

interface BalanceRadialChartProps {}

const BalanceRadialChart: React.FC<BalanceRadialChartProps> = () => {
  const { data } = useGetTotalYearBalances();

  const rawIncome =
    data?.reduce((acc, item) => acc + (item.amountIncome ?? 0), 0) ?? 0;
  const rawExpense =
    data?.reduce((acc, item) => acc + (item.amountExpense ?? 0), 0) ?? 0;
  const isZero = rawIncome === 0 && rawExpense === 0;

  const chartData = [
    {
      month: getCurrentMonth(),
      income: isZero ? 0.0001 : rawIncome,
      expense: isZero ? 0.0001 : rawExpense,
    },
  ];

  const chartConfig = {
    income: {
      label: "Desktop",
      color: isZero ? "var(--chart-neutral)" : "var(--chart-secondary)",
    },
    expense: {
      label: "Mobile",
      color: isZero ? "var(--chart-neutral)" : "var(--chart-warning)",
    },
  } satisfies ChartConfig;

  const totalVisitors = chartData?.[0]?.income - chartData?.[0]?.expense;

  const { location } = useLocationStore();

  const innerAndOuterRadius = useCallback(() => {
    switch (true) {
      case FormatCurrency(totalVisitors, location?.currency)?.length >= 23:
        return [140, 190];
      case FormatCurrency(totalVisitors, location?.currency)?.length >= 21:
        return [130, 175];
      case FormatCurrency(totalVisitors, location?.currency)?.length >= 19:
        return [120, 160];
      case FormatCurrency(totalVisitors, location?.currency)?.length >= 17:
        return [110, 145];
      case FormatCurrency(totalVisitors, location?.currency)?.length >= 14:
        return [100, 135];
      case FormatCurrency(totalVisitors, location?.currency)?.length >= 11:
        return [90, 125];
      default:
        return [80, 110];
    }
  }, [totalVisitors]);

  const minMaxWidthAndHeight = useCallback(() => {
    switch (true) {
      case FormatCurrency(totalVisitors, location?.currency)?.length >= 23:
        return "min-h-[350px] max-w-[350px]";
      case FormatCurrency(totalVisitors, location?.currency)?.length >= 21:
        return "min-h-[320px] max-w-[320px]";
      case FormatCurrency(totalVisitors, location?.currency)?.length >= 19:
        return "min-h-[280px] max-w-[280px]";
      case FormatCurrency(totalVisitors, location?.currency)?.length >= 17:
        return "min-h-[260px] max-w-[260px]";
      case FormatCurrency(totalVisitors, location?.currency)?.length >= 14:
        return "min-h-[240px] max-w-[240px]";
      case FormatCurrency(totalVisitors, location?.currency)?.length >= 11:
        return "min-h-[220px] max-w-[220px]";
      default:
        return "min-h-[200px] max-w-[200px]";
    }
  }, [totalVisitors]);

  const CustomTooltipContent = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }) => {
    if (!active || !payload || !payload.length) return null;

    // Example: Format as currency without decimals or symbol
    const income = payload[0].value;
    const expense = payload[1].value;

    const getIncome = FormatCurrency(income, location?.currency);
    const getExpense = FormatCurrency(expense, location?.currency);

    return (
      <div className="bg-base-100 p-2 rounded border border-base-300 shadow">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 bg-secondary rounded-xl" />
          <p>{getIncome}</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 bg-warning rounded-xl" />
          <p>{getExpense}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full sm:w-1/2 lg:w-full flex flex-col justify-between items-center py-10">
      <div className="w-full flex flex-col justify-start items-start gap-1">
        <p className="text-base-content text-opacity-50 text-xs">Income</p>
        <div className="flex items-center justify-start gap-1">
          <div className="w-4 h-2 bg-secondary rounded-full" />
          <p className="font-semibold">
            {FormatCurrency(chartData?.[0]?.income, location?.currency)}
          </p>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className={classNames(
          "mx-auto aspect-square w-full",
          minMaxWidthAndHeight()
        )}
      >
        <RadialBarChart
          width={300}
          height={300}
          data={chartData}
          startAngle={0}
          endAngle={360}
          innerRadius={innerAndOuterRadius()?.[0]}
          outerRadius={innerAndOuterRadius()?.[1]}
        >
          <ChartTooltip cursor={false} content={<CustomTooltipContent />} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy || 0}
                        className="fill-base-content text-lg font-semibold"
                      >
                        {FormatCurrency(totalVisitors, location?.currency)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 16}
                        className="fill-base-content"
                      >
                        {chartData?.[0]?.month} Balance
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey="income"
            stackId="a"
            cornerRadius={isZero ? 0 : 5}
            fill="var(--color-income)"
            className="stroke-transparent stroke-2"
          />
          <RadialBar
            dataKey="expense"
            fill="var(--color-expense)"
            stackId="a"
            cornerRadius={isZero ? 0 : 5}
            className="stroke-transparent stroke-2"
          />
        </RadialBarChart>
      </ChartContainer>
      <div className="w-full flex flex-col justify-end items-end gap-1">
        <p className="text-base-content text-opacity-50 text-xs">Expense</p>
        <div className="flex items-center justify-start gap-1">
          <div className="w-4 h-2 bg-warning rounded-full" />
          <p className="font-semibold">
            {FormatCurrency(chartData?.[0]?.expense, location?.currency)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceRadialChart;
