import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../../components/ui/Carousel";
import { Card, CardContent } from "../../../../components/ui/Card";
import "tippy.js/dist/tippy.css";
import Tooltip from "../../../../components/ui/Tooltip";
import classNames from "classnames";
import { useGetTransactionsCarousel } from "../../../../api/transaction.api";
import { format } from "date-fns";
import { FormatCurrency } from "../../../../helpers/currencyHelper";
import { useLocationStore } from "../../../../store/authStore";
import ActionMenu from "../../../components/actionMenu";

interface CurrentTransactionCarouselProps {
  handleShowIncome: () => void;
  setDefaultDataIncome: React.Dispatch<
    React.SetStateAction<TransactionsDataType | undefined>
  >;
  handleShowExpense: () => void;
  setDefaultDataExpense: React.Dispatch<
    React.SetStateAction<TransactionsDataType | undefined>
  >;
}

const CurrentExpenseCarousel = (props: CurrentTransactionCarouselProps) => {
  const { location } = useLocationStore();
  const { data, isFetching } = useGetTransactionsCarousel();

  return (
    <Carousel
      opts={{ align: "center" }}
      className="lg:max-w-[calc(100vw-360px)]"
    >
      <CarouselContent>
        {data?.length! > 0 ? (
          data?.map((transaction, index) => (
            <CarouselItem
              key={index}
              className="basis-full min-[540px]:basis-1/2 sm:basis-full lg:basis-1/2"
            >
              <Card className="!p-2">
                <CardContent className="!p-2">
                  <div className="flex items-center justify-between bg-accent/20 rounded-lg w-full px-2 py-2">
                    <p className="capitalize">
                      {transaction?._createdAt
                        ? `${transaction?.type} - ${format(
                            transaction._createdAt,
                            "dd/MM/yyyy HH:mm"
                          )}`
                        : transaction?.type ?? "-"}
                    </p>
                    <ActionMenu
                      align="vertical"
                      menu={[
                        {
                          label: "Edit",
                          action: () => {
                            props.handleShowIncome();
                            props.setDefaultDataIncome(transaction);
                          },
                          isActive: transaction.type === "income", // Assuming this is always active for editing
                        },
                        {
                          label: "Edit",
                          action: () => {
                            props.handleShowExpense();
                            props.setDefaultDataExpense(transaction);
                          },
                          isActive: transaction.type === "expense", // Assuming this is always active for editing
                        },
                      ]}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full py-2">
                    <div>
                      <p className="text-base-content/50">Category</p>
                      <div className="flex items-center gap-1">
                        <p>{transaction?.category?.categoryName ?? "-"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-base-content/50">Description</p>
                      <div className="flex items-center gap-1">
                        <p>{transaction?.description ?? "-"}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                      <div className="w-full">
                        <p className="text-base-content/50">Amount</p>
                        <div className="flex items-center gap-1">
                          {transaction?.type === "income" ? (
                            <div className="w-2 h-1 bg-secondary rounded-full" />
                          ) : (
                            <div className="w-2 h-1 bg-warning rounded-full" />
                          )}
                          <Tooltip
                            content={
                              <p>
                                {FormatCurrency(
                                  transaction?.amount ?? 0,
                                  location?.currency
                                ) ?? "-"}
                              </p>
                            }
                          >
                            <p className={classNames("text-ellipsis")}>
                              {FormatCurrency(
                                transaction?.amount ?? 0,
                                location?.currency
                              ) ?? "-"}
                            </p>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))
        ) : isFetching ? (
          <LoadingItem />
        ) : (
          <EmptyItem />
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

const LoadingItem = () => {
  return (
    <CarouselItem className="basis-full">
      <Card className="!p-2 min-h-48">
        <CardContent className="!p-2 animate-pulse">
          <div className="flex items-center justify-between bg-accent/20 rounded-lg w-full px-2 py-2">
            <div className="h-6 bg-accent/20 rounded-full w-32" />
          </div>
          <div className="flex flex-col gap-2 w-full py-2">
            <div className="flex flex-col gap-1">
              <div className="h-4 bg-accent/20 rounded-full w-1/3" />
              <div className="h-4 bg-accent/20 rounded-full w-full" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-4 bg-accent/20 rounded-full w-1/3" />
              <div className="h-4 bg-accent/20 rounded-full w-full" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-4 bg-accent/20 rounded-full w-1/3" />
              <div className="h-4 bg-accent/20 rounded-full w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </CarouselItem>
  );
};

const EmptyItem = () => {
  return (
    <CarouselItem className="basis-full">
      <Card className="!p-2">
        <CardContent className="!p-2">
          <div className="text-center min-h-44 h-full flex justify-center items-center">
            <p>You haven't add income or expense</p>
          </div>
        </CardContent>
      </Card>
    </CarouselItem>
  );
};

export default CurrentExpenseCarousel;
