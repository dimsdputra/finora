import * as Yup from "yup";

export type AddIncomeFormType = {
  amount: number;
  description: string;
  date: Date;
  type?: ("income" | "expense")[];
  category: string[];
  userId?: string;
};

export type AddIncomeFormValues = Omit<
  AddIncomeFormType,
  "type" | "category" | "date"
> & {
  date: string;
  type: "income" | "expense";
  category: string;
};

export const IncomeSchema: Yup.ObjectSchema<
  Omit<AddIncomeFormType, "type" | "userId">
> = Yup.object().shape({
  amount: Yup.number().required("Amount income is required"),
  description: Yup.string().required("Description is required"),
  date: Yup.date().required("Date is required"),
  category: Yup.array()
    .of(Yup.string().defined())
    .required("Category is required")
    .min(1, "At least one category is required"),
});

export const AddIncomeFormDefaultValues = (values?: TransactionsDataType) => ({
  amount: values?.amount,
  description: values?.description,
  date: values?.date,
  type: ["income"],
  category: values?.category?._id ? [values?.category._id] : undefined,
  userId: values?.user?._id,
});

export const incomeForm = (value: AddIncomeFormType): AddIncomeFormValues => ({
  amount: value.amount ? Number(value.amount) : 0,
  date: new Date(value?.date)?.toISOString(),
  description: value.description ?? "",
  type: "income",
  category: value.category?.[0] ?? "",
  userId: value.userId,
});
