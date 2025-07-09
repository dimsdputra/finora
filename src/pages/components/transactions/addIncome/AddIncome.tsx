import { useEffect, type JSX } from "react";
import AddIncomeView from "./AddIncome.View";
import { useForm } from "react-hook-form";
import {
  AddIncomeFormDefaultValues,
  incomeForm,
  IncomeSchema,
  type AddIncomeFormType,
} from "./add-income-utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetCategories } from "../../../../api/categories.api";
import { useAuthStore } from "../../../../store/authStore";
import {
  useCreateIncomeMutation,
  useUpdateIncomeMutation,
} from "../../../../api/transaction.api";
import type { DialogProps } from "@radix-ui/react-dialog";

export interface AddIncomeProps {
  mode: "edit" | "add";
  data?: TransactionsDataType;
  setDefaultData?: (data: TransactionsDataType | undefined) => void;
  handleClose: () => void;
  handleShow: () => void;
  RenderDialog: ({
    children,
    onOpenChange,
    ...props
  }: DialogProps) => JSX.Element;
}

const AddIncome = (props: AddIncomeProps) => {
  const { user } = useAuthStore();
  const { data: categoryData } = useGetCategories();

  const form = useForm<AddIncomeFormType>({
    resolver: yupResolver(IncomeSchema),
  });

  useEffect(() => {
    form.reset(AddIncomeFormDefaultValues(props.data) as AddIncomeFormType);
  }, [props.data]);

  const createIncome = useCreateIncomeMutation();
  const updateIncome = useUpdateIncomeMutation();

  const handleAddIncome = (value: AddIncomeFormType) => {
    const formValues = incomeForm({ ...value, userId: user?._id ?? "" });

    if (props.mode === "add") {
      createIncome.mutate(formValues, { onSuccess: () => props.handleClose() });
    } else {
      updateIncome.mutate(
        {
          value: { ...formValues, _id: props.data?._id ?? "" },
          defaultValues: incomeForm(
            form.formState.defaultValues as AddIncomeFormType
          ),
        },
        { onSuccess: () => props.handleClose() }
      );
    }
  };

  return (
    <AddIncomeView
      {...props}
      form={form}
      categoryData={categoryData}
      handleAddIncome={handleAddIncome}
    />
  );
};

export default AddIncome;
