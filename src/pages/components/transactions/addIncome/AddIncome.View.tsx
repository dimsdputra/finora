import { Button } from "../../../../components/ui/Button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/Dialog";
import type { AddIncomeProps } from "./AddIncome";
import { Input } from "../../../../components/ui/Input";
import { SelectForm } from "../../../../components/ui/MultiSelect";
import type { UseFormReturn } from "react-hook-form";
import type { AddIncomeFormType } from "./add-income-utils";
import { useLocationStore } from "../../../../store/authStore";
import { DatePickerForm } from "../../../../components/ui/DatePicker";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

interface AddIncomeViewProps extends AddIncomeProps {
  form: UseFormReturn<AddIncomeFormType, any, AddIncomeFormType>;
  categoryData: CategoriesDataType[] | undefined;
  handleAddIncome: (value: AddIncomeFormType) => void;
}

const AddIncomeView = (props: AddIncomeViewProps) => {
  const { location } = useLocationStore();

  return (
    <>
      <props.RenderDialog
        onOpenChange={() => props.setDefaultData?.(undefined)}
      >
        <DialogTrigger asChild className="w-full">
          <div className="cursor-pointer flex flex-col items-center gap-2 group min-w-full">
            <div className="bg-accent/80 rounded-lg w-fit px-4 py-2 hover:cursor-pointer transition-all duration-300 group-hover:bg-accent/50">
              <DocumentPlusIcon className="w-6 h-6 stroke-base-content" />
            </div>
            <p className="text-base-content text-xs">
              {props.mode === "add" ? "Add" : "Edit"} Income
            </p>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[420px] lg:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>
              {props.mode === "add" ? "Add" : "Edit"} income
            </DialogTitle>
          </DialogHeader>
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={props.form.handleSubmit(props.handleAddIncome)}
          >
            <div className="flex flex-col gap-4">
              <Input
                name="amount"
                prefix={location?.currency ?? "USD"}
                label={`Amount Income (${location?.currency ?? "USD"})`}
                type="currency"
                control={props.form.control}
                placeholder="Enter amount income..."
              />
              <DatePickerForm
                name="date"
                label="Date"
                mode="range"
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
                        ?.filter((category) => category.type === "income")
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
                  props.setDefaultData?.(undefined);
                }}
              >
                Cancel
              </Button>
              <Button variant="success">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </props.RenderDialog>
    </>
  );
};

export default AddIncomeView;
