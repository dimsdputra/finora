import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../../../../components/ui/Card";
import classNames from "classnames";
import { FormatCurrency } from "../../../../helpers/currencyHelper";
import { useLocationStore } from "../../../../store/authStore";

interface AmountInfoProps {
  dataIncome?: MonthlyBalancesDataType[] | undefined;
  dataExpense?: MonthlyBalancesDataType[] | undefined;
  type?: "income" | "expense";
}

const AmountInfo = ({
  dataIncome,
  dataExpense,
  type = "income",
}: AmountInfoProps) => {
  const { location } = useLocationStore();

  const rawIncome =
    dataIncome?.reduce((acc, item) => acc + (item.amountIncome ?? 0), 0) ?? 0;
  const rawExpense =
    dataExpense?.reduce((acc, item) => acc + (item.amountExpense ?? 0), 0) ?? 0;

  const totalBalance = rawIncome - rawExpense;

  return (
    <Card className={classNames("!p-0 !gap-0 w-full h-full")}>
      <CardHeader className="gap-0 pt-5 rounded-t-xl">
        <CardDescription
          className={classNames(
            "flex items-center justify-between sm:flex-col sm:items-start lg:flex-row lg:items-center lg:justify-between gap-2 px-2 py-1.5 rounded-md",
            type === "income" ? "bg-accent/20" : "bg-warning/50"
          )}
        >
          <p className="text-base-content">Balances</p>
          <p>
            {totalBalance !== 0 ? (
              totalBalance > 0 ? (
                `Financial Health: `
              ) : (
                `Warning: `
              )
            ) : (
              <span className="text-base-content/70 font-semibold">
                Zero Balance
              </span>
            )}
            <span>
              {totalBalance !== 0 ? (
                totalBalance > 0 ? (
                  <span className="text-success font-semibold">Good</span>
                ) : (
                  <span className="text-error font-semibold">Overspent</span>
                )
              ) : (
                ""
              )}
            </span>
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent
        className={classNames("rounded-xl py-6 sm:py-4 w-full h-full")}
      >
        <div className="flex flex-col gap-1 border-b border-base-content pb-2 mb-2">
          <p className="font-semibold">
            Income:{" "}
            <span className="text-success">
              {FormatCurrency(rawIncome, location?.currency)}
            </span>
          </p>
          <p className="font-semibold">
            Expense:{" "}
            <span className="text-error">
              {FormatCurrency(rawExpense, location?.currency)}
            </span>
          </p>
        </div>
        <p className="font-semibold">
          Total Balance:{" "}
          <span
            className={classNames(
              totalBalance !== 0
                ? totalBalance > 0
                  ? "text-success"
                  : "text-error"
                : "text-base-content"
            )}
          >
            {FormatCurrency(totalBalance, location?.currency)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default AmountInfo;
