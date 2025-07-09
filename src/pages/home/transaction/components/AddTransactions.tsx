import { PlusIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../../../../components/ui/Card";
import classNames from "classnames";
import AddIncome from "../../../components/transactions/addIncome";
import AddExpense from "../../../components/transactions/addExpense";
import type { UseDialogReturn } from "../../../../hooks/useDialog";

interface AddTransactionsProps extends UseDialogReturn {
  mode: "income" | "expense";
  defaultData: TransactionsDataType | undefined;
  setDefaultData: React.Dispatch<
    React.SetStateAction<TransactionsDataType | undefined>
  >;
}

const AddTransactions = (props: AddTransactionsProps) => {
  return (
    <Card
      className={classNames(
        "!p-0 !gap-0 w-full h-full",
        props.mode === "income" ? "!bg-accent/15" : "!bg-warning/50"
      )}
    >
      <CardHeader className="gap-0 py-3 rounded-t-xl">
        <CardDescription className="flex items-center gap-2">
          <PlusIcon
            className={classNames(
              "w-4 h-4 mr-1 stroke-[4]",
              props.mode === "income"
                ? "fill-accent stroke-accent"
                : "fill-warning stroke-white"
            )}
          />
          <p className="text-base-content">
            Add {props.mode === "income" ? "Income" : "Expense"}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent
        className={classNames(
          "rounded-xl py-6 sm:py-4 flex items-center justify-center w-full h-full",
          props.mode === "income" ? "bg-accent/50" : "bg-warning/60"
        )}
      >
        {props.mode === "income" ? (
          <AddIncome
            mode={props.defaultData ? "edit" : "add"}
            data={props.defaultData}
            setDefaultData={props.setDefaultData}
            RenderDialog={props.RenderDialog}
            handleShow={props.handleShow}
            handleClose={props.handleClose}
          />
        ) : (
          <>
            <AddExpense
              mode={props.defaultData ? "edit" : "add"}
              RenderDialog={props.RenderDialog}
              handleShow={props.handleShow}
              handleClose={props.handleClose}
              data={props.defaultData}
              setDefaultData={props.setDefaultData}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AddTransactions;
