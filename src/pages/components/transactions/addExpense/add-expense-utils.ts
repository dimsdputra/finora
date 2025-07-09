import * as Yup from "yup";

export type AddExpenseFormType = {
  amount: number;
  description: string;
  date: Date;
  type?: ("income" | "expense")[];
  category: string[];
  userId?: string;
};

export type AddExpenseFormValues = Omit<
  AddExpenseFormType,
  "type" | "category" | "date"
> & {
  date: string;
  type: "income" | "expense";
  category: string;
};

export const ExpenseSchema: Yup.ObjectSchema<
  Omit<AddExpenseFormType, "type" | "userId">
> = Yup.object().shape({
  amount: Yup.number().required("Amount income is required"),
  description: Yup.string().required("Description is required"),
  date: Yup.date().required("Date is required"),
  category: Yup.array()
    .of(Yup.string().defined())
    .required("Category is required")
    .min(1, "At least one category is required"),
});

export const AddExpenseFormDefaultValues = (values?: TransactionsDataType) => ({
  amount: values?.amount,
  description: values?.description,
  date: values?.date,
  type: ["expense"],
  category: values?.category?._id ? [values?.category._id] : undefined,
  userId: values?.user?._id,
});

export const expenseForm = (
  value: AddExpenseFormType
): AddExpenseFormValues => ({
  amount: value.amount ? Number(value.amount) : 0,
  date: new Date(value.date)?.toISOString(),
  description: value.description ?? "",
  type: "expense",
  category: value.category?.[0] ?? "",
  userId: value.userId,
});
