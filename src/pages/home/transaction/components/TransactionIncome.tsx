import { useEffect, useState } from "react";
import useDialog from "../../../../hooks/useDialog";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import { useGetTransactionIncome } from "../../../../api/transaction.api";
import { TabsContent } from "../../../../components/ui/Tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../../components/ui/Carousel";
import { Button } from "../../../../components/ui/Button";
import classNames from "classnames";
import { monthNames, months } from "../../../../helpers/generalHelpers";
import AmountInfo from "./AmountInfo";
import AddTransactions from "./AddTransactions";
import ChartAreaTransaction from "./ChartAreaTransaction";
import TableListTransactions from "./TableListTransactions";
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from "date-fns";
import {
  useGetTotalBalancesByExpense,
  useGetTotalBalancesByIncome,
} from "../../../../api/monthlyBalances.api";

const TransactionIncome = () => {
  const { RenderDialog, handleShow, handleClose } = useDialog();

  const [defaultDataIncome, setDefaultDataIncome] = useState<
    TransactionsDataType | undefined
  >();

  const [filterMonthIncome, setFilterMonthIncome] = useState<string>("All");
  const [selectYearIncome, setSelectYearIncome] = useState<string>("All");

  const paramsIncome = useQueryParams();

  const { data, refetch: refetchIncome } = useGetTransactionIncome(
    {
      ...paramsIncome,
      perPage: filterMonthIncome !== "All" ? 1000 : 50,
      pagination: {
        ...paramsIncome.pagination,
        paginationQuery:
          filterMonthIncome !== "All" ? "[0...1000]" : "[0...50]",
      },
    },
    selectYearIncome === "All" ? undefined : parseInt(selectYearIncome),
    selectYearIncome === "All"
      ? undefined
      : filterMonthIncome !== "All"
      ? parseInt(filterMonthIncome)
      : undefined
  );

  useEffect(() => {
    if (selectYearIncome === "All") {
      setFilterMonthIncome("All");
    }
  }, [selectYearIncome]);

  const currentYear = new Date().getFullYear();
  const [yearRangeIncome, setYearRangeIncome] = useState({
    start: currentYear - 5,
    end: currentYear + 5,
  });

  const handlePrevYear = () => {
    setYearRangeIncome((prev) => ({
      start: prev.start - 5,
      end: prev.end,
    }));
  };

  const handleNextYear = () => {
    setYearRangeIncome((prev) => ({
      start: prev.start,
      end: prev.end + 5,
    }));
  };

  const yearsIncome = [
    "All",
    ...Array.from(
      { length: yearRangeIncome.end - yearRangeIncome.start + 1 },
      (_, i) => (yearRangeIncome.start + i).toString()
    ),
  ];

  const year =
    selectYearIncome === "All" ? undefined : parseInt(selectYearIncome);
  const month =
    filterMonthIncome === "All" ? undefined : parseInt(filterMonthIncome);

  const startDate =
    year !== undefined && month !== undefined
      ? startOfMonth(new Date(year, month, 1))?.toISOString()
      : year
      ? startOfYear(new Date(year, 0, 1))?.toISOString()
      : undefined;
  const endDate =
    year !== undefined && month !== undefined
      ? endOfMonth(new Date(year, month, 1))?.toISOString()
      : year
      ? endOfYear(new Date(year, 0, 1))?.toISOString()
      : undefined;

  const { data: dataIncome } = useGetTotalBalancesByIncome(startDate, endDate);

  const { data: dataExpense } = useGetTotalBalancesByExpense(
    startDate,
    endDate
  );

  return (
    <TabsContent key={"income"} value={"income"}>
      <p className="mb-2 font-semibold">Select Year</p>
      <Carousel opts={{ align: "center" }} className="px-12 mb-4">
        <CarouselContent>
          {yearsIncome?.map((item) => (
            <CarouselItem key={item} className="!basis-auto">
              <Button
                variant={"outline"}
                className={classNames(
                  selectYearIncome === item
                    ? "!bg-accent !text-accent-content !transition-all !duration-300"
                    : ""
                )}
                onClick={() => setSelectYearIncome(item)}
              >
                {item}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          disabled={false}
          clickprev={(e) => !e && handlePrevYear()}
        />
        <CarouselNext
          disabled={false}
          clicknext={(e) => !e && handleNextYear()}
        />
      </Carousel>
      <p className="mb-2 font-semibold">Select Month</p>
      <Carousel opts={{ align: "center" }} className="px-12 mb-10">
        <CarouselContent>
          {months?.map((item, index) => (
            <CarouselItem key={item} className="!basis-auto">
              <Button
                variant={"outline"}
                disabled={item !== "All" && selectYearIncome === "All"}
                className={classNames(
                  filterMonthIncome === item
                    ? "!bg-accent !text-accent-content !transition-all !duration-300"
                    : ""
                )}
                onClick={() => setFilterMonthIncome(item)}
              >
                {monthNames[index]}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious clickprev={() => {}} />
        <CarouselNext clicknext={() => {}} />
      </Carousel>
      <div className="grid grid-cols-6 lg:grid-cols-7 gap-4 mt-4">
        <div className="col-span-6 lg:col-span-3 flex flex-col md:flex-row lg:flex-col gap-4 lg:pl-4 lg:border-l border-base-content">
          <div className="md:w-1/2 lg:w-full flex flex-col sm:flex-row md:flex-col xl:flex-row gap-4">
            <AmountInfo dataIncome={dataIncome} dataExpense={dataExpense} />
            <AddTransactions
              mode={"income"}
              RenderDialog={RenderDialog}
              handleShow={handleShow}
              handleClose={handleClose}
              defaultData={defaultDataIncome}
              setDefaultData={setDefaultDataIncome}
            />
          </div>
          <div className="w-full">
            <ChartAreaTransaction
              data={filterMonthIncome !== "All" ? data?.data : undefined}
              dataIncome={dataIncome}
              isAll={selectYearIncome === "All"}
              dateRange={{
                startDate:
                  year !== undefined && month !== undefined
                    ? startOfMonth(new Date(year, month, 1))
                    : year
                    ? startOfYear(new Date(year, 0, 1))
                    : undefined,
                endDate:
                  year !== undefined && month !== undefined
                    ? endOfMonth(new Date(year, month, 1))
                    : year
                    ? endOfYear(new Date(year, 0, 1))
                    : undefined,
              }}
            />
          </div>
        </div>
        <div className="col-span-6 lg:col-span-4 lg:order-first flex flex-col gap-4 lg:pr-1">
          <TableListTransactions
            data={data}
            refetch={refetchIncome}
            params={paramsIncome}
            activeTab={"income"}
            RenderDialog={RenderDialog}
            handleShow={handleShow}
            handleClose={handleClose}
            setDefaultData={setDefaultDataIncome}
            filterYear={selectYearIncome}
          />
        </div>
      </div>
    </TabsContent>
  );
};

export default TransactionIncome;
