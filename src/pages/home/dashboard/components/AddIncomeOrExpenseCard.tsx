import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../../../../components/ui/Card";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { UseDialogReturn } from "../../../../hooks/useDialog";
import AddIncome from "../../../components/transactions/addIncome";
import AddExpense from "../../../components/transactions/addExpense";

interface AddIncomeOrExpenseCardProps {
  dialogIncome: UseDialogReturn;
  dialogExpense: UseDialogReturn;
  setDefaultDataIncome: React.Dispatch<
    React.SetStateAction<TransactionsDataType | undefined>
  >;
  defaultDataIncome: TransactionsDataType | undefined;
  setDefaultDataExpense: React.Dispatch<
    React.SetStateAction<TransactionsDataType | undefined>
  >;
  defaultDataExpense: TransactionsDataType | undefined;
}

const AddIncomeOrExpenseCard = (props: AddIncomeOrExpenseCardProps) => {
  return (
    <Card className="!p-0 !gap-0 w-full h-fit !bg-secondary/10 ">
      <CardHeader className="gap-0 py-3 rounded-t-xl">
        <CardDescription className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4 mr-1 stroke-[4] fill-accent stroke-secondary" />
          <p className="text-base-content text-opacity-80">
            Add a New Expenses
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="rounded-xl bg-secondary/20 py-6 sm:py-4 flex items-center justify-center gap-4">
        <div className="w-fit">
          <AddIncome
            mode={props.defaultDataIncome ? "edit" : "add"}
            data={props.defaultDataIncome}
            setDefaultData={props.setDefaultDataIncome}
            RenderDialog={props.dialogIncome.RenderDialog}
            handleShow={props.dialogIncome.handleShow}
            handleClose={props.dialogIncome.handleClose}
            show={props.dialogIncome.show}
          />
        </div>
        <div className="w-fit">
          <AddExpense
            mode={props.defaultDataExpense ? "edit" : "add"}
            data={props.defaultDataExpense}
            setDefaultData={props.setDefaultDataExpense}
            RenderDialog={props.dialogExpense.RenderDialog}
            handleShow={props.dialogExpense.handleShow}
            handleClose={props.dialogExpense.handleClose}
            show={props.dialogExpense.show}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AddIncomeOrExpenseCard;
