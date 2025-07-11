import type { UseFormReturn } from "react-hook-form";
import type { AddExpenseFormType } from "./add-expense-utils";
import type { AddExpenseProps } from "./AddExpense";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/Dialog";
import { Input } from "../../../../components/ui/Input";
import { SelectForm } from "../../../../components/ui/MultiSelect";
import { Button } from "../../../../components/ui/Button";
import { useRef, useState, type PropsWithChildren } from "react";
import { useLocationStore } from "../../../../store/authStore";
import { DatePickerForm } from "../../../../components/ui/DatePicker";
import { DocumentMinusIcon } from "@heroicons/react/24/outline";
import { GoogleGenAI } from "@google/genai";
import useLoading from "../../../../hooks/useLoading";
import ImageAiComponent from "../ImageAiComponent";

interface AddExpenseViewProps extends AddExpenseProps {
  form: UseFormReturn<AddExpenseFormType, any, AddExpenseFormType>;
  categoryData: CategoriesDataType[] | undefined;
  handleAddExpense: (value: AddExpenseFormType) => void;
}

const AddExpenseView = (props: AddExpenseViewProps & PropsWithChildren) => {
  const { location } = useLocationStore();

  return (
    <props.RenderDialog>
      <DialogTrigger asChild className="w-full">
        <div className="cursor-pointer flex flex-col items-center gap-2 group min-w-full">
          <div className="bg-warning rounded-lg w-fit px-4 py-2 hover:cursor-pointer hover:bg-warning/40 transition-all duration-300 group-hover:bg-warning/90">
            <DocumentMinusIcon className="w-6 h-6 stroke-white" />
          </div>
          <p className="text-base-content text-xs">
            {props.mode === "add" ? "Add" : "Edit"} Expense
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] lg:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "add" ? "Add" : "Edit"} expense
          </DialogTitle>
        </DialogHeader>
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={props.form.handleSubmit(props.handleAddExpense)}
        >
          <div className="flex flex-col gap-4">
            <ImageAiComponent
              form={props.form}
              categoryData={props.categoryData}
            />
            <Input
              name="amount"
              prefix={location?.currency ?? "USD"}
              label={`Amount Expense (${location?.currency ?? "USD"})`}
              type="currency"
              control={props.form.control}
              placeholder="Enter amount income..."
            />
            <DatePickerForm
              name="date"
              label="Date"
              mode="single"
              control={props.form.control}
            />
            <Input
              name="description"
              control={props.form.control}
              label="Description"
              placeholder="Enter description..."
            />
            <SelectForm
              name="category"
              control={props.form.control}
              label="Category"
              placeholder="Select category..."
              options={
                props.categoryData
                  ? props.categoryData
                      ?.filter((category) => category.type === "expense")
                      ?.map((category) => ({
                        label: category.categoryName ?? "-",
                        value: category._id ?? "-",
                      }))
                  : []
              }
            />
          </div>
          <DialogFooter>
            <Button
              variant="error"
              onClick={() => {
                props.handleClose();
              }}
            >
              Cancel
            </Button>
            <Button variant="success">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </props.RenderDialog>
  );
};

export default AddExpenseView;
