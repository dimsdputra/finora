import { useState } from "react";
import { useGetCategories } from "../../../../api/categories.api";
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
import { CategoriesIcons } from "../../../../helpers/iconCategoriesHelpers";
import { useGetTransactionByCategory } from "../../../../api/transaction.api";
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from "date-fns";
import { useGetTotalBalancesByCategory } from "../../../../api/monthlyBalances.api";
import { monthNames, months } from "../../../../helpers/generalHelpers";
import TableListCategories from "./TableListCategories";
import { ChartArea } from "./ChartArea";
import useDialog from "../../../../hooks/useDialog";
import AddExpense from "../../../components/transactions/addExpense";

const CategoriesExpense = () => {
  const { RenderDialog, handleShow, handleClose } = useDialog();

  const [defaultDataExpense, setDefaultDataExpense] = useState<
    TransactionsDataType | undefined
  >();

  const [categoryExpenseActive, setCategoryExpenseActive] = useState<
    string | undefined
  >("Education");
  const [filterMonthExpense, setFilterMonthExpense] = useState<string>("All");
  const [selectYearExpense, setSelectYearExpense] = useState<string>("All");

  const { data } = useGetCategories();

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

  const { data: categoryData, refetch } = useGetTransactionByCategory({
    categoryName: categoryExpenseActive ?? "Education",
    type: "expense",
    year,
    month,
  });

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

  const { data: dataExpense } = useGetTotalBalancesByCategory(
    categoryExpenseActive ?? "Education",
    startDate,
    endDate
  );

  return (
    <>
      <div className="hidden">
        <AddExpense
          mode={"edit"}
          data={defaultDataExpense}
          setDefaultData={setDefaultDataExpense}
          RenderDialog={RenderDialog}
          handleShow={handleShow}
          handleClose={handleClose}
        />
      </div>
      <TabsContent value={"expense"}>
        <Carousel opts={{ align: "center" }} className="sm:hidden">
          <CarouselContent>
            {data
              ?.filter((filterCategory) => filterCategory?.type === "expense")
              ?.map((category) => (
                <CarouselItem key={category._id} className="!basis-auto">
                  <Button
                    variant={"outline"}
                    className={classNames(
                      categoryExpenseActive === category.categoryName
                        ? "!bg-info !text-info-content !transition-all !duration-300"
                        : ""
                    )}
                    onClick={() =>
                      setCategoryExpenseActive(category.categoryName)
                    }
                  >
                    <span className="w-4 h-4">
                      {CategoriesIcons(category.categoryName)}
                    </span>
                    {category.categoryName}
                  </Button>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="hidden sm:flex flex-wrap gap-2">
          {data
            ?.filter((filterCategory) => filterCategory?.type === "expense")
            ?.map((category) => (
              <Button
                key={category._id}
                variant={"outline"}
                className={classNames(
                  categoryExpenseActive === category.categoryName
                    ? "!bg-info !text-info-content !transition-all !duration-300"
                    : ""
                )}
                onClick={() => setCategoryExpenseActive(category.categoryName)}
              >
                <span className="w-4 h-4">
                  {CategoriesIcons(category.categoryName)}
                </span>
                {category.categoryName}
              </Button>
            ))}
        </div>

        <div className="mt-5 py-4 border-t border-base-content flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <p className="font-semibold">
              {`${categoryExpenseActive}: `}
              {
                data?.find(
                  (category) => category.categoryName === categoryExpenseActive
                )?.description
              }
            </p>
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
          </div>
          <div className="flex flex-col-reverse md:grid md:grid-cols-8 gap-5">
            <div className="md:col-span-4 flex flex-col gap-4">
              <TableListCategories
                categoryData={categoryData}
                refetch={refetch}
                activeTab={"income"}
                RenderDialog={RenderDialog}
                handleShow={handleShow}
                handleClose={handleClose}
                setDefaultData={setDefaultDataExpense}
                filterYear={selectYearExpense}
              />
            </div>
            <div className="md:col-span-4">
              <ChartArea
                data={filterMonthExpense !== "All" ? categoryData : undefined}
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
        </div>
      </TabsContent>
    </>
  );
};

export default CategoriesExpense;
