import { useEffect, useState, type PropsWithChildren } from "react";
import AddExpenseView from "./AddExpense.View";
import { useGetCategories } from "../../../../api/categories.api";
import { useForm } from "react-hook-form";
import {
  AddExpenseFormDefaultValues,
  expenseForm,
  ExpenseSchema,
  type AddExpenseFormType,
} from "./add-expense-utils";
import {
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
} from "../../../../api/transaction.api";
import { useAuthStore } from "../../../../store/authStore";
import { yupResolver } from "@hookform/resolvers/yup";
import type { UseDialogReturn } from "../../../../hooks/useDialog";

export interface AddExpenseProps extends UseDialogReturn {
  mode: "edit" | "add";
  data?: TransactionsDataType;
  setDefaultData?: (data: TransactionsDataType | undefined) => void;
}

const AddExpense = (props: AddExpenseProps & PropsWithChildren) => {
  const { user } = useAuthStore();

  const { data: categoryData } = useGetCategories();

  const form = useForm<AddExpenseFormType>({
    resolver: yupResolver(ExpenseSchema),
  });

  useEffect(() => {
    if (props.show) {
      form.reset(AddExpenseFormDefaultValues(props.data) as AddExpenseFormType);
    } else {
      props.setDefaultData?.(undefined);
    }
  }, [props.data, form, props.show]);

  const createExpense = useCreateExpenseMutation();
  const updateExpense = useUpdateExpenseMutation();

  const handleAddExpense = (value: AddExpenseFormType) => {
    const formValues = expenseForm({ ...value, userId: user?._id ?? "" });

    if (props.mode === "add") {
      createExpense.mutate(formValues, {
        onSuccess: () => props.handleClose(),
      });
    } else {
      updateExpense.mutate(
        {
          value: { ...formValues, _id: props.data?._id ?? "" },
          defaultValues: expenseForm(
            form.formState.defaultValues as AddExpenseFormType
          ),
        },
        { onSuccess: () => props.handleClose() }
      );
    }
  };

  return (
    <AddExpenseView
      {...props}
      form={form}
      categoryData={categoryData}
      handleAddExpense={handleAddExpense}
    />
  );
};

export default AddExpense;
