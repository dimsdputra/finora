import { endOfMonth, startOfMonth } from "date-fns";

export const capitalizeWords = (str: string): string => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getMonthDatesWithSums = (
  transactions: TransactionsDataType[] | undefined,
  year: number,
  month: number
) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const sums: Record<string, number> = {};
  transactions?.forEach((tx) => {
    const date = (tx._createdAt as unknown as string)?.slice(0, 10); // "YYYY-MM-DD"
    sums[date!] = (sums[date!] || 0) + tx?.amount!;
  });

  const result = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month - 1, day);
    const dateStr = dateObj.toISOString().slice(0, 10);
    const label = dateObj.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    }); // 'Jun 1'
    result.push({
      date: label,
      amount: sums[dateStr] || 0,
    });
  }
  return result;
};

export const isFullYear = (startDate: Date, endDate: Date) =>
  startDate?.getDate() === 1 &&
  startDate?.getMonth() === 0 &&
  endDate?.getDate() === 31 &&
  endDate?.getMonth() === 11 &&
  startDate?.getFullYear() === endDate?.getFullYear();

export const getMonthDateRangesWithSums = (
  transactions: TransactionsDataType[] | undefined,
  dateRange: { startDate: Date | undefined; endDate: Date | undefined }
) => {
  const { startDate, endDate } = dateRange;

  if (!startDate || !endDate) return [];

  const allSums: Record<string, number> = {};

  transactions?.forEach((tx) => {
    const date = (tx.date as unknown as string)?.slice(0, 10);
    allSums[date] = (allSums[date] || 0) + (tx?.amount ?? 0);
  });

  const result: { date: string; amount: number }[] = [];

  if (isFullYear(startDate, endDate)) {
    // Group by month
    for (let m = 0; m < 12; m++) {
      const monthStart = new Date(startDate.getFullYear(), m, 1);
      const monthEnd = endOfMonth(monthStart);
      let sum = 0;
      for (
        let d = new Date(monthStart);
        d <= monthEnd;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().slice(0, 10);
        sum += allSums[dateStr] || 0;
      }
      const label = monthStart.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
      result.push({ date: label, amount: sum });
    }
  } else {
    // Group by date
    let currentStartDate = startOfMonth(new Date(startDate));
    let currentEndDate = endOfMonth(new Date(endDate));
    while (currentStartDate.getTime() <= currentEndDate.getTime()) {
      const dateStr = currentStartDate.toISOString().slice(0, 10);
      const day = currentStartDate.getDate();
      const month = currentStartDate.toLocaleString("en-US", {
        month: "short",
      });
      const year = currentStartDate.getFullYear();
      const label = `${day} ${month} ${year}`;

      result.push({
        date: label,
        amount: allSums[dateStr] || 0,
      });

      currentStartDate.setDate(currentStartDate.getDate() + 1);
    }
  }

  return result;
};

export const getMonthDateRangesWithSumsByType = (
  transactions: MonthlyBalancesDataType[] | undefined,
  dateRange: { startDate: Date | undefined; endDate: Date | undefined },
  type: "income" | "expense"
) => {
  const { startDate, endDate } = dateRange;

  if (!startDate || !endDate) return [];

  const isFullYear =
    startDate.getDate() === 1 &&
    startDate.getMonth() === 0 &&
    endDate.getDate() === 31 &&
    endDate.getMonth() === 11 &&
    startDate.getFullYear() === endDate.getFullYear();

  const result: { date: string; amount: number }[] = [];

  if (isFullYear) {
    // Group by month
    for (let m = 0; m < 12; m++) {
      const monthBalances = transactions?.filter(
        (b) => b.year === startDate.getFullYear() && b.month === m
      );
      const sum =
        monthBalances?.reduce(
          (acc, b) =>
            acc +
            (type === "income" ? b.amountIncome ?? 0 : b.amountExpense ?? 0),
          0
        ) ?? 0;
      const label = new Date(startDate.getFullYear(), m, 1).toLocaleString(
        "en-US",
        {
          month: "short",
          year: "numeric",
        }
      );
      result.push({ date: label, amount: sum });
    }
  } else {
    // Group by date (per day in the month)
    let currentStartDate = startOfMonth(new Date(startDate));
    let currentEndDate = endOfMonth(new Date(endDate));
    while (currentStartDate.getTime() <= currentEndDate.getTime()) {
      const dayBalances = transactions?.filter(
        (b) =>
          b.year === currentStartDate.getFullYear() &&
          b.month === currentStartDate.getMonth()
      );
      const sum =
        dayBalances?.reduce(
          (acc, b) =>
            acc +
            (type === "income" ? b.amountIncome ?? 0 : b.amountExpense ?? 0),
          0
        ) ?? 0;
      const label = currentStartDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      });
      result.push({ date: label, amount: sum });
      currentStartDate.setDate(currentStartDate.getDate() + 1);
    }
  }

  return result;
};

export const getYearlySumsByType = (
  transactions: MonthlyBalancesDataType[] | undefined,
  type: "income" | "expense"
) => {
  if (!transactions) return [];

  // Group and sum by year
  const yearSums: Record<number, number> = {};

  transactions.forEach((tx) => {
    const year = tx.year as number;
    const amount =
      type === "income" ? tx.amountIncome ?? 0 : tx.amountExpense ?? 0;
    yearSums[year] = (yearSums[year] || 0) + amount;
  });

  // Format result
  return Object.entries(yearSums)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([year, amount]) => ({
      date: year, // label is the year
      amount,
    }));
};

export const months = [
  "All",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
];

export const monthNames = [
  "All",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
