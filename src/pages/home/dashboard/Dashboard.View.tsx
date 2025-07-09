import { useAuthStore } from "../../../store/authStore";
import BalanceRadialChart from "./components/BalanceRadialChart";
import CurrentExpenseCarousel from "./components/CurrentExpenseCarousel";
import AddIncomeOrExpenseCard from "./components/AddIncomeOrExpenseCard";
import TableList from "./components/TableList";
import type { UseDialogReturn } from "../../../hooks/useDialog";

interface DashboardViewProps {
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

const DashboardView = (props: DashboardViewProps) => {
  const { user } = useAuthStore();

  return (
    <section className="w-full h-full px-8 py-5 lg:flex lg:gap-8">
      <div className="w-full lg:w-1/3">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-semibold">
            Hello {user?.displayName},
          </h2>
          <p className="text-base-content text-opacity-50 text-xs">
            Take a look at your current balance <span>👀</span>
          </p>
        </div>
        <div className="w-full sm:flex sm:gap-8 md:gap-10 lg:flex-col lg:gap-0">
          <BalanceRadialChart />
          <div className="w-full sm:w-1/2 lg:w-full flex flex-col gap-4 sm:gap-6 py-10 lg:py-0">
            <div className="flex flex-col gap-2 lg:hidden">
              <h2 className="px-5 font-semibold">
                Your Current Income or Expense
              </h2>
              <CurrentExpenseCarousel
                handleShowIncome={props.dialogIncome.handleShow}
                setDefaultDataIncome={props.setDefaultDataIncome}
                handleShowExpense={props.dialogExpense.handleShow}
                setDefaultDataExpense={props.setDefaultDataExpense}
              />
            </div>
            <AddIncomeOrExpenseCard {...props} />
          </div>
        </div>
      </div>
      <div className="w-full lg:w-2/3 flex flex-col gap-4 lg:gap-6">
        <div className="hidden lg:flex lg:flex-col lg:gap-4">
          <h2 className="px-5 font-semibold">Your Current Income or Expense</h2>
          <CurrentExpenseCarousel
            handleShowIncome={props.dialogIncome.handleShow}
            setDefaultDataIncome={props.setDefaultDataIncome}
            handleShowExpense={props.dialogExpense.handleShow}
            setDefaultDataExpense={props.setDefaultDataExpense}
          />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="px-5 font-semibold">Your Income or Expense List</h2>
          <TableList
            handleShowIncome={props.dialogIncome.handleShow}
            setDefaultDataIncome={props.setDefaultDataIncome}
            handleShowExpense={props.dialogExpense.handleShow}
            setDefaultDataExpense={props.setDefaultDataExpense}
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardView;
