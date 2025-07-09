import { useEffect, useState } from "react";
import useDialog from "../../../../hooks/useDialog";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import { useGetTransactionExpense } from "../../../../api/transaction.api";
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

const TransactionExpense = () => {
  const { RenderDialog, handleShow, handleClose } = useDialog();

  const [defaultDataExpense, setDefaultDataExpense] = useState<
    TransactionsDataType | undefined
  >();

  const [filterMonthExpense, setFilterMonthExpense] = useState<string>("All");
  const [selectYearExpense, setSelectYearExpense] = useState<string>("All");

  const paramsExpense = useQueryParams();
  const { data, refetch } = useGetTransactionExpense(
    {
      ...paramsExpense,
      perPage: filterMonthExpense !== "All" ? 1000 : 50,
      pagination: {
        ...paramsExpense.pagination,
        paginationQuery:
          filterMonthExpense !== "All" ? "[0...1000]" : "[0...50]",
      },
    },
    selectYearExpense === "All" ? undefined : parseInt(selectYearExpense),
    selectYearExpense === "All"
      ? undefined
      : filterMonthExpense !== "All"
      ? parseInt(filterMonthExpense)
      : undefined
  );

  useEffect(() => {
    if (selectYearExpense === "All") {
      setFilterMonthExpense("All");
    }
  }, [selectYearExpense]);

  const currentYear = new Date().getFullYear();
  const [yearRangeExpense, setYearRangeExpense] = useState({
    start: currentYear - 5,
    end: currentYear + 5,
  });

  const handlePrevYear = () => {
    setYearRangeExpense((prev) => ({
      start: prev.start - 5,
      end: prev.end,
    }));
  };

  const handleNextYear = () => {
    setYearRangeExpense((prev) => ({
      start: prev.start,
      end: prev.end + 5,
    }));
  };

  const yearsExpense = [
    "All",
    ...Array.from(
      { length: yearRangeExpense.end - yearRangeExpense.start + 1 },
      (_, i) => (yearRangeExpense.start + i).toString()
    ),
  ];

  const year =
    selectYearExpense === "All" ? undefined : parseInt(selectYearExpense);
  const month =
    filterMonthExpense === "All" ? undefined : parseInt(filterMonthExpense);

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

  const { data: dataExpense } = useGetTotalBalancesByExpense(
    startDate,
    endDate
  );

  const { data: dataIncome } = useGetTotalBalancesByIncome(startDate, endDate);

  return (
    <TabsContent key={"expense"} value={"expense"}>
      <p className="mb-2 font-semibold">Select Year</p>
      <Carousel opts={{ align: "center" }} className="px-12 mb-4">
        <CarouselContent>
          {yearsExpense?.map((item) => (
            <CarouselItem key={item} className="!basis-auto">
              <Button
                variant={"outline"}
                className={classNames(
                  selectYearExpense === item
                    ? "!bg-info !text-info-content !transition-all !duration-300"
                    : ""
                )}
                onClick={() => setSelectYearExpense(item)}
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
                disabled={item !== "All" && selectYearExpense === "All"}
                className={classNames(
                  filterMonthExpense === item
                    ? "!bg-info !text-info-content !transition-all !duration-300"
                    : ""
                )}
                onClick={() => setFilterMonthExpense(item)}
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
            <AmountInfo dataExpense={dataExpense} dataIncome={dataIncome} type="expense" />
            <AddTransactions
              mode={"expense"}
              RenderDialog={RenderDialog}
              handleShow={handleShow}
              handleClose={handleClose}
              defaultData={defaultDataExpense}
              setDefaultData={setDefaultDataExpense}
            />
          </div>
          <div className="w-full">
            <ChartAreaTransaction
              data={filterMonthExpense !== "All" ? data?.data : undefined}
              dataExpense={dataExpense}
              isAll={selectYearExpense === "All"}
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
            refetch={refetch}
            params={paramsExpense}
            activeTab={"expense"}
            RenderDialog={RenderDialog}
            handleShow={handleShow}
            handleClose={handleClose}
            setDefaultData={setDefaultDataExpense}
            filterYear={selectYearExpense}
          />
        </div>
      </div>
    </TabsContent>
  );
};

export default TransactionExpense;
