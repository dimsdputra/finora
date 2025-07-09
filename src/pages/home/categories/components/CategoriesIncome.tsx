import classNames from "classnames";
import { Button } from "../../../../components/ui/Button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../../components/ui/Carousel";
import { TabsContent } from "../../../../components/ui/Tabs";
import { useState } from "react";
import { CategoriesIcons } from "../../../../helpers/iconCategoriesHelpers";
import { useGetCategories } from "../../../../api/categories.api";
import { monthNames, months } from "../../../../helpers/generalHelpers";
import { useGetTransactionByCategory } from "../../../../api/transaction.api";
import TableListCategories from "./TableListCategories";
import { ChartArea } from "./ChartArea";
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from "date-fns";
import { useGetTotalBalancesByCategory } from "../../../../api/monthlyBalances.api";
import useDialog from "../../../../hooks/useDialog";
import AddIncome from "../../../components/transactions/addIncome";

const CategoriesIncome = () => {
  const { RenderDialog, handleShow, handleClose } = useDialog();

  const [defaultDataIncome, setDefaultDataIncome] = useState<
    TransactionsDataType | undefined
  >();

  const [categoryIncomeActive, setCategoryIncomeActive] = useState<
    string | undefined
  >("Bonus");

  const [filterMonthIncome, setFilterMonthIncome] = useState<string>("All");
  const [selectYearIncome, setSelectYearIncome] = useState<string>("All");

  const { data } = useGetCategories();

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

  const { data: categoryData, refetch } = useGetTransactionByCategory({
    categoryName: categoryIncomeActive ?? "Bonus",
    type: "income",
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

  const { data: dataIncome } = useGetTotalBalancesByCategory(
    categoryIncomeActive ?? "Bonus",
    startDate,
    endDate
  );

  return (
    <>
      <div className="hidden">
        <AddIncome
          mode={"edit"}
          data={defaultDataIncome}
          setDefaultData={setDefaultDataIncome}
          RenderDialog={RenderDialog}
          handleShow={handleShow}
          handleClose={handleClose}
        />
      </div>
      <TabsContent value={"income"}>
        <Carousel opts={{ align: "center" }} className="sm:hidden">
          <CarouselContent>
            {data
              ?.filter((filterCategory) => filterCategory?.type === "income")
              ?.map((category) => (
                <CarouselItem key={category._id} className="!basis-auto">
                  <Button
                    variant={"outline"}
                    className={classNames(
                      categoryIncomeActive === category.categoryName
                        ? "!bg-info !text-info-content !transition-all !duration-300"
                        : ""
                    )}
                    onClick={() =>
                      setCategoryIncomeActive(category.categoryName)
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
            ?.filter((filterCategory) => filterCategory?.type === "income")
            ?.map((category) => (
              <Button
                key={category._id}
                variant={"outline"}
                className={classNames(
                  categoryIncomeActive === category.categoryName
                    ? "!bg-info !text-info-content !transition-all !duration-300"
                    : ""
                )}
                onClick={() => setCategoryIncomeActive(category.categoryName)}
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
              {`${categoryIncomeActive}: `}
              {
                data?.find(
                  (category) => category.categoryName === categoryIncomeActive
                )?.description
              }
            </p>
            <p className="mb-2 font-semibold">Select Year</p>
            <Carousel opts={{ align: "center" }} className="px-12 mb-4">
              <CarouselContent>
                {yearsIncome?.map((item) => (
                  <CarouselItem key={item} className="!basis-auto">
                    <Button
                      variant={"outline"}
                      className={classNames(
                        selectYearIncome === item
                          ? "!bg-info !text-info-content !transition-all !duration-300"
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
                          ? "!bg-info !text-info-content !transition-all !duration-300"
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
                setDefaultData={setDefaultDataIncome}
                filterYear={selectYearIncome}
              />
            </div>
            <div className="md:col-span-4">
              <ChartArea
                data={filterMonthIncome !== "All" ? categoryData : undefined}
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
        </div>
      </TabsContent>
    </>
  );
};

export default CategoriesIncome;
