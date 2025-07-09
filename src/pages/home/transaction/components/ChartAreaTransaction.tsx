import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/Card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "../../../../components/ui/Chart";
import { FormatCurrency } from "../../../../helpers/currencyHelper";
import { useLocationStore } from "../../../../store/authStore";
import {
  getMonthDateRangesWithSums,
  getMonthDateRangesWithSumsByType,
  getYearlySumsByType,
  isFullYear,
} from "../../../../helpers/generalHelpers";
import { format, parse } from "date-fns";

export const description = "Chart Area by Category";

const chartConfig = (type: "income" | "expense") =>
  ({
    desktop: {
      label: "Desktop",
      color:
        type === "income" ? "var(--chart-secondary)" : "var(--chart-warning)",
    },
  } satisfies ChartConfig);

type ChartTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
  indicator?: "line" | "dot";
};

export const CustomChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  indicator = "line",
}) => {
  const { location } = useLocationStore();
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-base-100 border border-base-300 rounded shadow p-2 min-w-[100px]">
      <div className="font-semibold mb-1">{label}</div>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {indicator === "dot" && (
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: entry.color,
              }}
            />
          )}
          <span className="capitalize">{entry.name}:</span>
          <span className="font-bold">
            {FormatCurrency(entry.value ?? 0, location?.currency)}
          </span>
        </div>
      ))}
    </div>
  );
};

const ChartAreaTransaction = ({
  data,
  dataIncome,
  dataExpense,
  dateRange,
  isAll = false,
}: {
  data?: TransactionsDataType[];
  dataIncome?: MonthlyBalancesDataType[];
  dataExpense?: MonthlyBalancesDataType[];
  isAll?: boolean;
  dateRange: { startDate: Date | undefined; endDate: Date | undefined };
}) => {
  const result =
    data !== undefined
      ? getMonthDateRangesWithSums(data, dateRange)
      : dataIncome !== undefined
      ? isAll
        ? getYearlySumsByType(dataIncome, "income")
        : getMonthDateRangesWithSumsByType(dataIncome, dateRange, "income")
      : isAll
      ? getYearlySumsByType(dataExpense, "expense")
      : getMonthDateRangesWithSumsByType(dataExpense, dateRange, "expense");

  const chartData =
    result.length > 0
      ? result?.length === 1
        ? [
            {
              date: isAll ? Number(result[0]?.date) - 1 : "",
              amount: 0,
            },
            ...result,
          ] // Add a dummy point to allow the line to render
        : result
      : [{ date: "", amount: 0 }];

  const maxAmount = Math.max(...result.map((item) => item.amount));
  const safeMax = maxAmount > 0 ? maxAmount : 1;

  return (
    <Card className="justify-between h-full">
      <CardHeader>
        <CardTitle className="text-xs">Area Chart</CardTitle>
        <CardDescription className="text-xs">
          Displays the total number of transactions per day based on date range.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig(dataIncome !== undefined ? "income" : "expense")}
        >
          <AreaChart
            width={330}
            height={194}
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeOpacity={0.3} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              // tickFormatter={(value, index) => (index === 0 ? "" : "")}
              tickFormatter={(value) => {
                if (isAll) {
                  return value; // For yearly sums, return the month name
                } else {
                  // Parse "1 Jun 2025" as day month year
                  const date = parse(value, "d MMM yyyy", new Date());
                  return !isFullYear(
                    dateRange?.startDate as Date,
                    dateRange?.endDate as Date
                  )
                    ? date.getDate()
                      ? format(date, "d")
                      : ""
                    : value.split(" ")[0];
                }
              }}
              interval={0}
              // interval={interval}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={0}
              domain={[0, safeMax * 1.2]}
              tickFormatter={() => ""}
            />
            <ChartTooltip
              cursor={false}
              content={<CustomChartTooltip indicator="line" />}
            />
            <Area
              dataKey="amount"
              type="linear"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartAreaTransaction;
