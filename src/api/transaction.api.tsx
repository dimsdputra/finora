import useLoading from "../hooks/useLoading";
import { useAuthStore } from "../store/authStore";
import { sanityReadClient, sanityWriteClient } from "../config/sanity.config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryParamsReturn } from "../hooks/useQueryParams";
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from "date-fns";
import type { AddIncomeFormValues } from "../pages/components/transactions/addIncome/add-income-utils";
import { toast } from "sonner";
import type { AddExpenseFormValues } from "../pages/components/transactions/addExpense/add-expense-utils";

export interface ResponseDataArray<T> {
  data: T[];
  total: number;
}

export const useGetTransactionsCarousel = () => {
  const { user } = useAuthStore();
  const { setLoading } = useLoading();

  const transactionsQuery = `
    *[_type == "transactions" && user->userId == $userId] | order(_updatedAt desc) [0...5] {
      _id,
      _createdAt,
      _updatedAt,
      amount,
      date,
      type,
      description,
      category->{
        _id,
        categoryName
      },
      user->{
        _id,
        userId,
        name,
        currency
      }
    }
  `;

  return useQuery<TransactionsDataType[]>({
    queryKey: ["transactionsCarousel", user?.uid].filter(Boolean),
    queryFn: async () => {
      setLoading(true);
      try {
        const fetch = await sanityReadClient.fetch(transactionsQuery, {
          userId: user?.uid,
        });

        return fetch;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        throw new Error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    },
    enabled: !!user?.uid,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useGetTransactions = (params: UseQueryParamsReturn) => {
  const { user } = useAuthStore();
  const { setLoading } = useLoading();

  const transactionsQuery = `
    *[_type == "transactions" && user->userId == $userId${
      params?.filterQueryParams ?? ""
    }${params?.searchQueryParams ?? ""}] | order(${params?.orderQueryParams}) ${
    params?.filterQueryParams || params?.searchQueryParams
      ? `[0...${params?.perPage}]`
      : params?.pagination.paginationQuery ?? ""
  } {
      _id,
      _createdAt,
      _updatedAt,
      amount,
      date,
      type,
      description,
      category->{
        _id,
        categoryName
      },
      user->{
        _id,
        userId,
        name,
        currency
      }
    }
  `;

  const countQuery = `
    count(*[_type == "transactions" && user->userId == $userId${
      params?.filterQueryParams ?? ""
    }${params?.searchQueryParams ?? ""}] | order(${
    params?.orderQueryParams ?? ""
  }))`;

  const total = async () => {
    const totalData = await sanityReadClient.fetch(countQuery, {
      userId: user?.uid,
    });

    params.setTotalData(totalData);

    return totalData || 0;
  };

  return useQuery<ResponseDataArray<TransactionsDataType>>({
    queryKey: [
      "transactions",
      user?.uid,
      params?.filterQueryParams,
      params?.searchQueryParams,
      params?.orderQueryParams,
      params?.pagination?.paginationQuery,
    ].filter(Boolean),
    queryFn: async () => {
      setLoading(true);
      try {
        const fetch = await sanityReadClient.fetch(transactionsQuery, {
          userId: user?.uid,
        });

        return {
          data: fetch,
          total: await total(),
        };
      } catch (error) {
        console.error("Error fetching transactions:", error);
        throw new Error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    },
    enabled: !!user?.uid,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData,
  });
};

export const useGetTransactionByCategory = ({
  categoryName,
  type,
  year,
  month,
}: {
  categoryName: string;
  type: string;
  year: number | undefined;
  month: number | undefined;
}) => {
  const { user } = useAuthStore();
  const { setLoading } = useLoading();

  const startDate =
    year !== undefined && month !== undefined
      ? startOfMonth(new Date(year, month, 1))?.toISOString()
      : year
      ? startOfYear(new Date(year, 0, 1))?.toISOString()
      : "";
  const endDate =
    year !== undefined && month !== undefined
      ? endOfMonth(new Date(year, month, 1))?.toISOString()
      : year
      ? endOfYear(new Date(year, 0, 1))?.toISOString()
      : "";

  const paramsFilterMonth = ` && date >= "${startDate}" && date <= "${endDate}"`;

  const transactionsQuery = `
    *[_type == "transactions" && user->userId == $userId && type == $type && category->categoryName == $categoryName${
      year ? paramsFilterMonth : ""
    }] | order(_createdAt desc) {
      _id,
      _createdAt,
      _updatedAt,
      amount,
      date,
      type,
      description,
      category->{
        _id,
        categoryName
      },
      user->{
        _id,
        userId,
        name,
        currency
      }
    }
  `;

  return useQuery<TransactionsDataType[]>({
    queryKey: [
      "transactionsByCategories",
      user?.uid,
      categoryName,
      type,
      year,
      month,
    ].filter(Boolean),
    queryFn: async () => {
      setLoading(true);
      try {
        const fetch = await sanityReadClient.fetch(transactionsQuery, {
          userId: user?.uid,
          type: type,
          categoryName: categoryName,
        });

        return fetch;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        throw new Error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    },
    enabled: !!user?.uid,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData,
  });
};

export const useGetTransactionIncome = (
  params: UseQueryParamsReturn,
  year: number | undefined,
  month: number | undefined
) => {
  const { user } = useAuthStore();
  const { setLoading } = useLoading();

  const getFilterMonth = Object.keys(params?.filters)?.find(
    (key) => key === "_createdAt"
  );

  const startDate =
    year !== undefined && month !== undefined
      ? startOfMonth(new Date(year, month, 1))?.toISOString()
      : year
      ? startOfYear(new Date(year, 0, 1))?.toISOString()
      : "";
  const endDate =
    year !== undefined && month !== undefined
      ? endOfMonth(new Date(year, month, 1))?.toISOString()
      : year
      ? endOfYear(new Date(year, 0, 1))?.toISOString()
      : "";

  const paramsFilterMonth = ` && date >= "${startDate}" && date <= "${endDate}"`;

  const transactionsQuery = `
    *[_type == "transactions"${
      getFilterMonth === undefined ? (year ? paramsFilterMonth : "") : ""
    } && user->userId == $userId && type == "income"${
    params?.filterQueryParams ?? ""
  }${params?.searchQueryParams ?? ""}] | order(${params?.orderQueryParams}) ${
    params?.filterQueryParams || params?.searchQueryParams
      ? `[0...${params?.perPage}]`
      : params?.pagination.paginationQuery ?? ""
  } {
      _id,
      _createdAt,
      _updatedAt,
      amount,
      date,
      type,
      description,
      category->{
        _id,
        categoryName
      },
      user->{
        _id,
        userId,
        name,
        currency
      }
    }
  `;

  const countQuery = `
    count(*[_type == "transactions"${
      getFilterMonth === undefined ? paramsFilterMonth : ""
    } && user->userId == $userId && type == "income" ${
    params?.filterQueryParams ?? ""
  }${params?.searchQueryParams ?? ""}] | order(${
    params?.orderQueryParams ?? ""
  }))`;

  const total = async () => {
    setLoading(true);
    try {
      const totalData = await sanityReadClient.fetch(countQuery, {
        userId: user?.uid,
      });

      params.setTotalData(totalData);

      return totalData || 0;
    } catch (error) {
      throw new Error("Failed to fetch total income transactions");
    }
  };

  return useQuery<ResponseDataArray<TransactionsDataType>>({
    queryKey: [
      "transactionsIncome",
      user?.uid,
      params?.filterQueryParams,
      params?.searchQueryParams,
      params?.orderQueryParams,
      params?.pagination?.paginationQuery,
      year,
      month,
    ].filter(Boolean),
    queryFn: async () => {
      setLoading(true);
      try {
        const fetch = await sanityReadClient.fetch(transactionsQuery, {
          userId: user?.uid,
        });

        return {
          data: fetch,
          total: await total(),
        };
      } catch (error) {
        console.error("Error fetching income transactions:", error);
        throw new Error("Failed to fetch income transactions");
      } finally {
        setLoading(false);
      }
    },
    enabled: !!user?.uid,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData,
  });
};

export const useGetTransactionExpense = (
  params: UseQueryParamsReturn,
  year: number | undefined,
  month: number | undefined
) => {
  const { user } = useAuthStore();
  const { setLoading } = useLoading();

  const getFilterMonth = Object.keys(params?.filters)?.find(
    (key) => key === "_createdAt"
  );

  const startDate =
    year !== undefined && month !== undefined
      ? startOfMonth(new Date(year, month, 1))?.toISOString()
      : year !== undefined
      ? startOfYear(new Date(year, 0, 1))?.toISOString()
      : "";
  const endDate =
    year !== undefined && month !== undefined
      ? endOfMonth(new Date(year, month, 1))?.toISOString()
      : year !== undefined
      ? endOfYear(new Date(year, 0, 1))?.toISOString()
      : "";

  const paramsFilterMonth = ` && date >= "${startDate}" && date <= "${endDate}"`;

  const transactionsQuery = `
    *[_type == "transactions"${
      getFilterMonth === undefined ? (year ? paramsFilterMonth : "") : ""
    } && user->userId == $userId && type == "expense" ${
    params?.filterQueryParams ?? ""
  }${params?.searchQueryParams ?? ""}] | order(${params?.orderQueryParams}) ${
    params?.filterQueryParams || params?.searchQueryParams
      ? `[0...${params?.perPage}]`
      : params?.pagination.paginationQuery ?? ""
  } {
      _id,
      _createdAt,
      _updatedAt,
      amount,
      date,
      type,
      description,
      category->{
        _id,
        categoryName
      },
      user->{
        _id,
        userId,
        name,
        currency
      }
    }
  `;

  const countQuery = `
    count(*[_type == "transactions"${
      getFilterMonth === undefined ? paramsFilterMonth : ""
    } && user->userId == $userId && type == "expense" ${
    params?.filterQueryParams ?? ""
  }${params?.searchQueryParams ?? ""}] | order(${
    params?.orderQueryParams ?? ""
  }))`;

  const total = async () => {
    setLoading(true);
    try {
      const totalData = await sanityReadClient.fetch(countQuery, {
        userId: user?.uid,
      });

      params.setTotalData(totalData);

      return totalData || 0;
    } catch (error) {
      throw new Error("Failed to fetch total income transactions");
    }
  };

  return useQuery<ResponseDataArray<TransactionsDataType>>({
    queryKey: [
      "transactionsExpense",
      user?.uid,
      params?.filterQueryParams,
      params?.searchQueryParams,
      params?.orderQueryParams,
      params?.pagination?.paginationQuery,
      year,
      month,
    ].filter(Boolean),
    queryFn: async () => {
      setLoading(true);
      try {
        const fetch = await sanityReadClient.fetch(transactionsQuery, {
          userId: user?.uid,
        });

        return {
          data: fetch,
          total: await total(),
        };
      } catch (error) {
        console.error("Error fetching income transactions:", error);
        throw new Error("Failed to fetch income transactions");
      } finally {
        setLoading(false);
      }
    },
    enabled: !!user?.uid,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateIncomeMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading } = useLoading();

  return useMutation({
    mutationKey: ["createIncome"],
    mutationFn: async (value: AddIncomeFormValues) => {
      if (!value) throw new Error("Transaction data is required for creation");

      setLoading(true);

      const month = new Date(value.date).getMonth(); // Months are 0-indexed in JavaScript
      const year = new Date(value.date).getFullYear();
      const categoryId = value.category;

      const monthlyBalances: MonthlyBalancesDataType[] =
        await sanityReadClient.fetch(
          `
        *[_type == "monthlyBalances" && user->_id == $userId && year == $year && month == $month && category->_id == $categoryId]`,
          { userId: value.userId, year, month, categoryId }
        );

      const response = await sanityWriteClient.create({
        _type: "transactions",
        amount: value.amount,
        date: value.date,
        description: value.description ?? "",
        type: "income",
        user: {
          _type: "reference",
          _ref: value.userId,
        },
        category: {
          _type: "reference",
          _ref: value.category,
        },
      });

      if (response?._id) {
        // Update monthly balances if they exist
        if (monthlyBalances && monthlyBalances.length > 0) {
          const balance = monthlyBalances[0];
          const updatedBalance = {
            ...balance,
            amountIncome: (balance.amountIncome || 0) + value.amount,
          };

          const responseBalance = await sanityWriteClient
            .patch(balance?._id ?? "")
            .set(updatedBalance)
            .commit();

          if (responseBalance?._id) {
            return response;
          }
        } else {
          // Create new monthly balance if it doesn't exist
          const responseBalance = await sanityWriteClient.create({
            _type: "monthlyBalances",
            user: {
              _type: "reference",
              _ref: value.userId,
            },
            year: year,
            month: month,
            amountIncome: value.amount,
            amountExpense: 0,
            category: {
              _type: "reference",
              _ref: categoryId,
            },
          });

          if (responseBalance?._id) {
            return response;
          }
        }
      } else {
        throw new Error("Failed to create transaction");
      }

      // return response;
    },
    onSuccess: () => {
      toast.success("Transaction created successfully!");
      setLoading(false);
      // Invalidate relevant queries to force refetch of latest data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.refetchQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsCarousel"] });
      queryClient.refetchQueries({ queryKey: ["transactionsCarousel"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyBalances"] });
      queryClient.refetchQueries({ queryKey: ["monthlyBalances"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsByCategories"] });
      queryClient.refetchQueries({ queryKey: ["transactionsByCategories"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsIncome"] });
      queryClient.refetchQueries({ queryKey: ["transactionsIncome"] });
      queryClient.invalidateQueries({ queryKey: ["totalBalancesByIncome"] });
      queryClient.refetchQueries({ queryKey: ["totalBalancesByIncome"] });
    },
    onError: () => {
      setLoading(false);
      toast.error("Failed to create transaction");
      throw new Error("Failed to create transaction");
    },
  });
};

export const useCreateExpenseMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading } = useLoading();

  return useMutation({
    mutationKey: ["createExpense"],
    mutationFn: async (value: AddExpenseFormValues) => {
      if (!value) throw new Error("Transaction data is required for creation");

      setLoading(true);

      const month = new Date(value.date).getMonth(); // Months are 0-indexed in JavaScript
      const year = new Date(value.date).getFullYear();
      const categoryId = value.category;

      const monthlyBalances: MonthlyBalancesDataType[] =
        await sanityReadClient.fetch(
          `
        *[_type == "monthlyBalances" && user->_id == $userId && year == $year && month == $month && category->_id == $categoryId]`,
          { userId: value.userId, year, month, categoryId }
        );

      const response = await sanityWriteClient.create({
        _type: "transactions",
        amount: value.amount,
        date: value.date,
        description: value.description ?? "",
        type: "expense",
        user: {
          _type: "reference",
          _ref: value.userId,
        },
        category: {
          _type: "reference",
          _ref: value.category,
        },
      });

      if (response?._id) {
        // Update monthly balances if they exist
        if (monthlyBalances && monthlyBalances.length > 0) {
          const balance = monthlyBalances[0];
          const updatedBalance = {
            ...balance,
            amountExpense: (balance.amountExpense || 0) + value.amount,
          };

          const responseBalance = await sanityWriteClient
            .patch(balance?._id ?? "")
            .set(updatedBalance)
            .commit();

          if (responseBalance?._id) {
            return response;
          }
        } else {
          // Create new monthly balance if it doesn't exist
          const responseBalance = await sanityWriteClient.create({
            _type: "monthlyBalances",
            user: {
              _type: "reference",
              _ref: value.userId,
            },
            year: year,
            month: month,
            amountIncome: 0,
            amountExpense: value.amount,
            category: {
              _type: "reference",
              _ref: categoryId,
            },
          });

          if (responseBalance?._id) {
            return response;
          }
        }
      } else {
        throw new Error("Failed to create transaction");
      }

      // return response;
    },
    onSuccess: () => {
      toast.success("Transaction created successfully!");
      setLoading(false);
      // Invalidate relevant queries to force refetch of latest data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.refetchQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsCarousel"] });
      queryClient.refetchQueries({ queryKey: ["transactionsCarousel"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyBalances"] });
      queryClient.refetchQueries({ queryKey: ["monthlyBalances"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsByCategories"] });
      queryClient.refetchQueries({ queryKey: ["transactionsByCategories"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsExpense"] });
      queryClient.refetchQueries({ queryKey: ["transactionsExpense"] });
      queryClient.invalidateQueries({ queryKey: ["totalBalancesByExpense"] });
      queryClient.refetchQueries({ queryKey: ["totalBalancesByExpense"] });
    },
    onError: () => {
      setLoading(false);
      toast.error("Failed to create transaction");
      throw new Error("Failed to create transaction");
    },
  });
};

export const useUpdateIncomeMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading } = useLoading();

  return useMutation({
    mutationKey: ["updateIncome"],
    mutationFn: async ({
      value,
      defaultValues,
    }: {
      value: AddIncomeFormValues & { _id: string };
      defaultValues: AddIncomeFormValues;
    }) => {
      if (!value) throw new Error("Transaction data is required for update");

      setLoading(true);

      const month = new Date(value.date).getMonth(); // Months are 0-indexed in JavaScript
      const year = new Date(value.date).getFullYear();
      const categoryId = value.category;

      const monthlyBalances: MonthlyBalancesDataType[] =
        await sanityReadClient.fetch(
          `
        *[_type == "monthlyBalances" && user->_id == $userId && year == $year && month == $month && category->_id == $categoryId]`,
          { userId: value.userId, year, month, categoryId }
        );

      const response = await sanityWriteClient
        .patch(value._id)
        .set({
          amount: value.amount,
          date: value.date,
          description: value.description ?? "",
          type: "income",
          user: {
            _type: "reference",
            _ref: value.userId,
          },
          category: {
            _type: "reference",
            _ref: value.category,
          },
        })
        .commit();

      if (response?._id) {
        // Update monthly balances if they exist
        if (monthlyBalances && monthlyBalances.length > 0) {
          const balance = monthlyBalances[0];
          const updatedBalance = {
            ...balance,
            amountIncome:
              (balance.amountIncome ?? 0) - defaultValues.amount + value.amount,
          };

          const responseBalance = await sanityWriteClient
            .patch(balance?._id ?? "")
            .set(updatedBalance)
            .commit();

          if (responseBalance?._id) {
            return response;
          }
        }
      } else {
        throw new Error("Failed to create transaction");
      }
    },
    onSuccess: () => {
      toast.success("Transaction created successfully!");
      setLoading(false);
      // Invalidate relevant queries to force refetch of latest data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.refetchQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsCarousel"] });
      queryClient.refetchQueries({ queryKey: ["transactionsCarousel"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyBalances"] });
      queryClient.refetchQueries({ queryKey: ["monthlyBalances"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsByCategories"] });
      queryClient.refetchQueries({ queryKey: ["transactionsByCategories"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsIncome"] });
      queryClient.refetchQueries({ queryKey: ["transactionsIncome"] });
      queryClient.invalidateQueries({ queryKey: ["totalBalancesByIncome"] });
      queryClient.refetchQueries({ queryKey: ["totalBalancesByIncome"] });
    },
    onError: () => {
      setLoading(false);
      toast.error("Failed to create transaction");
      throw new Error("Failed to create transaction");
    },
  });
};

export const useUpdateExpenseMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading } = useLoading();

  return useMutation({
    mutationKey: ["updateExpense"],
    mutationFn: async ({
      value,
      defaultValues,
    }: {
      value: AddExpenseFormValues & { _id: string };
      defaultValues: AddExpenseFormValues;
    }) => {
      if (!value) throw new Error("Transaction data is required for update");

      setLoading(true);

      const month = new Date(value.date).getMonth(); // Months are 0-indexed in JavaScript
      const year = new Date(value.date).getFullYear();
      const categoryId = value.category;

      const monthlyBalances: MonthlyBalancesDataType[] =
        await sanityReadClient.fetch(
          `
        *[_type == "monthlyBalances" && user->_id == $userId && year == $year && month == $month && category->_id == $categoryId]`,
          { userId: value.userId, year, month, categoryId }
        );

      const response = await sanityWriteClient
        .patch(value._id)
        .set({
          amount: value.amount,
          date: value.date,
          description: value.description ?? "",
          type: "expense",
          user: {
            _type: "reference",
            _ref: value.userId,
          },
          category: {
            _type: "reference",
            _ref: value.category,
          },
        })
        .commit();

      if (response?._id) {
        // Update monthly balances if they exist
        if (monthlyBalances && monthlyBalances.length > 0) {
          const balance = monthlyBalances[0];
          const updatedBalance = {
            ...balance,
            amountExpense:
              (balance.amountExpense ?? 0) -
              defaultValues.amount +
              value.amount,
          };

          const responseBalance = await sanityWriteClient
            .patch(balance?._id ?? "")
            .set(updatedBalance)
            .commit();

          if (responseBalance?._id) {
            return response;
          }
        }
      } else {
        throw new Error("Failed to create transaction");
      }
    },
    onSuccess: () => {
      toast.success("Transaction created successfully!");
      setLoading(false);
      // Invalidate relevant queries to force refetch of latest data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.refetchQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsCarousel"] });
      queryClient.refetchQueries({ queryKey: ["transactionsCarousel"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyBalances"] });
      queryClient.refetchQueries({ queryKey: ["monthlyBalances"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsByCategories"] });
      queryClient.refetchQueries({ queryKey: ["transactionsByCategories"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsExpense"] });
      queryClient.refetchQueries({ queryKey: ["transactionsExpense"] });
      queryClient.invalidateQueries({ queryKey: ["totalBalancesByExpense"] });
      queryClient.refetchQueries({ queryKey: ["totalBalancesByExpense"] });
    },
    onError: () => {
      setLoading(false);
      toast.error("Failed to create transaction");
      throw new Error("Failed to create transaction");
    },
  });
};

export const useDeleteExpenseMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading } = useLoading();

  return useMutation({
    mutationKey: ["deleteExpense"],
    mutationFn: async (expense: TransactionsDataType) => {
      if (!expense?._id) throw new Error("Expense ID is required for deletion");

      setLoading(true);

      // Find the related monthlyBalances document
      const month = new Date(expense.date as Date).getMonth();
      const year = new Date(expense.date as Date).getFullYear();
      const categoryId = expense.category?._id;
      const userId = expense.user?._id;

      const monthlyBalances: MonthlyBalancesDataType[] =
        await sanityReadClient.fetch(
          `*[_type == "monthlyBalances" && user->_id == $userId && year == $year && month == $month && category->_id == $categoryId]`,
          { userId, year, month, categoryId }
        );

      // Delete the expense transaction
      await sanityWriteClient.delete(expense._id);

      // Update monthlyBalances if found
      if (monthlyBalances && monthlyBalances.length > 0) {
        const balance = monthlyBalances[0];
        const updatedExpense =
          (balance.amountExpense ?? 0) - (expense.amount ?? 0);

        // If the expense becomes zero, you may want to delete the monthlyBalances doc, or just update it
        await sanityWriteClient
          .patch(balance._id as string)
          .set({ amountExpense: updatedExpense < 0 ? 0 : updatedExpense })
          .commit();
      }

      setLoading(false);
      return true;
    },
    onSuccess: () => {
      toast.success("Expense deleted successfully!");
      // Invalidate relevant queries to force refetch of latest data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.refetchQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsCarousel"] });
      queryClient.refetchQueries({ queryKey: ["transactionsCarousel"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyBalances"] });
      queryClient.refetchQueries({ queryKey: ["monthlyBalances"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsByCategories"] });
      queryClient.refetchQueries({ queryKey: ["transactionsByCategories"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsExpense"] });
      queryClient.refetchQueries({ queryKey: ["transactionsExpense"] });
      queryClient.invalidateQueries({ queryKey: ["totalBalancesByExpense"] });
      queryClient.refetchQueries({ queryKey: ["totalBalancesByExpense"] });
    },
    onError: () => {
      setLoading(false);
      toast.error("Failed to delete expense");
      throw new Error("Failed to delete expense");
    },
  });
};

export const useDeleteIncomeMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading } = useLoading();

  return useMutation({
    mutationKey: ["deleteIncome"],
    mutationFn: async (income: TransactionsDataType) => {
      if (!income?._id) throw new Error("Income ID is required for deletion");

      setLoading(true);

      // Find the related monthlyBalances document
      const month = new Date(income.date as Date).getMonth();
      const year = new Date(income.date as Date).getFullYear();
      const categoryId = income.category?._id;
      const userId = income.user?._id;

      const monthlyBalances: MonthlyBalancesDataType[] =
        await sanityReadClient.fetch(
          `*[_type == "monthlyBalances" && user->_id == $userId && year == $year && month == $month && category->_id == $categoryId]`,
          { userId, year, month, categoryId }
        );

      // Delete the expense transaction
      await sanityWriteClient.delete(income._id);

      // Update monthlyBalances if found
      if (monthlyBalances && monthlyBalances.length > 0) {
        const balance = monthlyBalances[0];
        const updatedIncome =
          (balance.amountIncome ?? 0) - (income.amount ?? 0);

        // If the income becomes zero, you may want to delete the monthlyBalances doc, or just update it
        await sanityWriteClient
          .patch(balance._id as string)
          .set({ amountIncome: updatedIncome < 0 ? 0 : updatedIncome })
          .commit();
      }

      setLoading(false);
      return true;
    },
    onSuccess: () => {
      toast.success("Income deleted successfully!");
      // Invalidate relevant queries to force refetch of latest data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.refetchQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsCarousel"] });
      queryClient.refetchQueries({ queryKey: ["transactionsCarousel"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyBalances"] });
      queryClient.refetchQueries({ queryKey: ["monthlyBalances"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsByCategories"] });
      queryClient.refetchQueries({ queryKey: ["transactionsByCategories"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsIncome"] });
      queryClient.refetchQueries({ queryKey: ["transactionsIncome"] });
      queryClient.invalidateQueries({ queryKey: ["totalBalancesByIncome"] });
      queryClient.refetchQueries({ queryKey: ["totalBalancesByIncome"] });
    },
    onError: () => {
      setLoading(false);
      toast.error("Failed to delete income");
      throw new Error("Failed to delete income");
    },
  });
};
