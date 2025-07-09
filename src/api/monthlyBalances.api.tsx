import { useQuery } from "@tanstack/react-query";
import useLoading from "../hooks/useLoading";
import { useAuthStore } from "../store/authStore";
import { sanityReadClient } from "../config/sanity.config";

export const useGetTotalYearBalances = () => {
  const { user } = useAuthStore();
  const { setLoading } = useLoading();

  const monthlyBalancesQuery = `
    *[_type == "monthlyBalances" && user->userId == $userId] | order(year desc, month desc)
  `;

  return useQuery<MonthlyBalancesDataType[]>({
    queryKey: ["monthlyBalances", user?.uid],
    queryFn: async () => {
      setLoading(true);
      try {
        const fetch = await sanityReadClient.fetch(monthlyBalancesQuery, {
          userId: user?.uid,
        });

        return fetch;
      } catch (error) {
        console.error("Error fetching Balances:", error);
        throw new Error("Failed to fetch Balances");
      } finally {
        setLoading(false);
      }
    },
    enabled: !!user?.uid,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    placeholderData: (prev) => prev,
  });
};

export const useGetTotalBalancesByIncome = (
  startDate: string | undefined,
  endDate: string | undefined
) => {
  const { user } = useAuthStore();
  const { setLoading } = useLoading();

  const startYear = new Date(startDate!)?.getFullYear();
  const startMonth = new Date(startDate!)?.getMonth(); // Months are 0-indexed in JavaScript
  const endYear = new Date(endDate!)?.getFullYear();
  const endMonth = new Date(endDate!)?.getMonth(); // Months are 0-indexed in JavaScript

  const queryParams =
    startDate !== undefined && endDate !== undefined
      ? `&& year >= ${startYear} && year <= ${endYear} && month >= ${startMonth} && month <= ${endMonth}`
      : startDate
      ? `&& year >= ${startYear} && year >= ${endYear}`
      : "";

  const totalBalancesByIncomeQuery = `
        *[_type == "monthlyBalances" && user->userId == $userId && amountIncome >= 0 && amountExpense == 0 ${queryParams}] | order(year desc, month desc)
    `;

  return useQuery<MonthlyBalancesDataType[]>({
    queryKey: ["totalBalancesByIncome", user?.uid, startDate, endDate],
    queryFn: async () => {
      setLoading(true);
      try {
        const fetch = await sanityReadClient.fetch(totalBalancesByIncomeQuery, {
          userId: user?.uid,
        });

        return fetch;
      } catch (error) {
        console.error("Error fetching Total Balances by Income:", error);
        throw new Error("Failed to fetch Total Balances by Income");
      } finally {
        setLoading(false);
      }
    },
    enabled: !!user?.uid,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    placeholderData: (prev) => prev,
  });
};

export const useGetTotalBalancesByExpense = (
  startDate: string | undefined,
  endDate: string | undefined
) => {
  const { user } = useAuthStore();
  const { setLoading } = useLoading();

  const startYear = new Date(startDate!)?.getFullYear();
  const startMonth = new Date(startDate!)?.getMonth(); // Months are 0-indexed in JavaScript
  const endYear = new Date(endDate!)?.getFullYear();
  const endMonth = new Date(endDate!)?.getMonth(); // Months are 0-indexed in JavaScript

  const queryParams =
    startDate !== undefined && endDate !== undefined
      ? `&& year >= ${startYear} && year <= ${endYear} && month >= ${startMonth} && month <= ${endMonth}`
      : startDate
      ? `&& year >= ${startYear} && year >= ${endYear}`
      : "";

  const totalBalancesByIncomeQuery = `
        *[_type == "monthlyBalances" && user->userId == $userId && amountExpense >= 0 && amountIncome == 0 ${queryParams}] | order(year desc, month desc)
    `;

  return useQuery<MonthlyBalancesDataType[]>({
    queryKey: ["totalBalancesByExpense", user?.uid, startDate, endDate],
    queryFn: async () => {
      setLoading(true);
      try {
        const fetch = await sanityReadClient.fetch(totalBalancesByIncomeQuery, {
          userId: user?.uid,
        });

        return fetch;
      } catch (error) {
        console.error("Error fetching Total Balances by Expense:", error);
        throw new Error("Failed to fetch Total Balances by Expense");
      } finally {
        setLoading(false);
      }
    },
    enabled: !!user?.uid,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    placeholderData: (prev) => prev,
  });
};

export const useGetTotalBalancesByCategory = (
  categoryName: string,
  startDate: string | undefined,
  endDate: string | undefined
) => {
  const { user } = useAuthStore();
  const { setLoading } = useLoading();

  const startYear = new Date(startDate!)?.getFullYear();
  const startMonth = new Date(startDate!)?.getMonth(); // Months are 0-indexed in JavaScript
  const endYear = new Date(endDate!)?.getFullYear();
  const endMonth = new Date(endDate!)?.getMonth(); // Months are 0-indexed in JavaScript

  const queryParams =
    startDate !== undefined && endDate !== undefined
      ? `&& year >= ${startYear} && year <= ${endYear} && month >= ${startMonth} && month <= ${endMonth}`
      : startDate
      ? `&& year >= ${startYear} && year >= ${endYear}`
      : "";

  const totalBalancesByIncomeQuery = `
        *[_type == "monthlyBalances" && user->userId == $userId && category->categoryName == $categoryName ${queryParams}] | order(year desc, month desc)
    `;

  return useQuery<MonthlyBalancesDataType[]>({
    queryKey: ["totalBalancesByIncome", user?.uid, startDate, endDate, categoryName],
    queryFn: async () => {
      setLoading(true);
      try {
        const fetch = await sanityReadClient.fetch(totalBalancesByIncomeQuery, {
          userId: user?.uid,
          categoryName: categoryName,
        });

        return fetch;
      } catch (error) {
        console.error("Error fetching Total Balances by Income:", error);
        throw new Error("Failed to fetch Total Balances by Income");
      } finally {
        setLoading(false);
      }
    },
    enabled: !!user?.uid,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    placeholderData: (prev) => prev,
  });
};