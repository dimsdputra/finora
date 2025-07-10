import { Table } from "../../../../components/ui/Table";
import { capitalizeWords } from "../../../../helpers/generalHelpers";
import {
  useDeleteExpenseMutation,
  useDeleteIncomeMutation,
  useGetTransactions,
} from "../../../../api/transaction.api";
import { format } from "date-fns";
import Tooltip from "../../../../components/ui/Tooltip";
import { FormatCurrency } from "../../../../helpers/currencyHelper";
import { useLocationStore } from "../../../../store/authStore";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import { useGetCategories } from "../../../../api/categories.api";
import ActionMenu from "../../../components/actionMenu";
import useDialog from "../../../../hooks/useDialog";
import { useCallback, useState } from "react";
import ModalConfirmations from "../../../components/modal/ModalConfirmations";
import classNames from "classnames";

interface TableListProps {
  handleShowIncome: () => void;
  setDefaultDataIncome: React.Dispatch<
    React.SetStateAction<TransactionsDataType | undefined>
  >;
  handleShowExpense: () => void;
  setDefaultDataExpense: React.Dispatch<
    React.SetStateAction<TransactionsDataType | undefined>
  >;
}

const TableList = (props: TableListProps) => {
  const { location } = useLocationStore();
  const params = useQueryParams();
  const { data, refetch } = useGetTransactions(params);
  const { data: categories } = useGetCategories();

  const { RenderDialog, handleShow, handleClose } = useDialog();

  const [getData, setGetData] = useState<TransactionsDataType | undefined>();
  const deleteExpenseMutation = useDeleteExpenseMutation();
  const deleteIncomeMutation = useDeleteIncomeMutation();

  const handleDelete = useCallback(() => {
    if (!getData) return;
    if (getData.type === "expense") {
      deleteExpenseMutation.mutate(getData);
    } else {
      deleteIncomeMutation.mutate(getData);
    }
  }, [getData]);

  return (
    <>
      <ModalConfirmations
        type="warning"
        RenderDialog={RenderDialog}
        handleClose={() => {
          handleClose();
          setGetData(undefined);
        }}
        handleShow={handleShow}
        title="Delete!"
        description="Are you sure you want to delete this item?"
        handleSave={handleDelete}
      />
      <Table
        searchField={["type", "category.categoryName"]}
        filterOptions={[
          {
            label: "Type",
            name: "type",
            options: [
              { label: "Income", value: "income" },
              { label: "Expense", value: "expense" },
            ],
            type: "multiSelect",
          },
          {
            label: "Category",
            name: "category._id",
            type: "multiSelect",
            options:
              categories?.map((category) => ({
                label: category.categoryName ?? "-",
                value: category._id ?? "-",
              })) ?? [],
          },
          {
            label: "Date",
            name: "date",
            type: "dateInterval",
          },
        ]}
        refetch={refetch}
        data={data?.data}
        params={params}
        headers={[
          { name: "no", className: "w-[50px]" },
          { name: "Type", sortable: true, sortKey: "type" },
          { name: "Amount", sortable: true, sortKey: "amount" },
          {
            name: "Category",
            sortable: true,
            sortKey: "category.categoryName",
          },
          { name: "Date", sortable: true, sortKey: "date" },
          { name: "Description", sortable: true, sortKey: "description" },
          { name: "Last Edited", sortable: true, sortKey: "_updatedAt" },
          { name: "Action", className: "text-center" },
        ]}
        renderers={[
          (_, index) => (params.page - 1) * params.perPage + index + 1,
          (row) => <p className={classNames("border-b", row.type === 'income' ? "border-secondary" : "border-warning")}>{capitalizeWords(row.type ?? "-")}</p>,
          (row) => FormatCurrency(row.amount ?? 0, location?.currency),
          (row) => row.category?.categoryName ?? "-",
          (row) => (row.date ? format(row.date, "dd/MM/yyyy") : "-"),
          (row) => (
            <Tooltip content={<p>{row.description ?? "-"}</p>}>
              <p className="max-w-[300px] truncate">{row.description ?? "-"}</p>
            </Tooltip>
          ),
          (row) =>
            row._updatedAt ? format(row._updatedAt, "dd/MM/yyyy HH:mm") : "-",
          (row) => (
            <div className="flex justify-center items-center">
              <ActionMenu
                menu={[
                  {
                    label: "Edit",
                    action: () => {
                      props.handleShowIncome();
                      props.setDefaultDataIncome(row);
                    },
                    isActive: row.type === "income", // Assuming this is always active for editing
                  },
                  {
                    label: "Edit",
                    action: () => {
                      props.handleShowExpense();
                      props.setDefaultDataExpense(row);
                    },
                    isActive: row.type === "expense", // Assuming this is always active for editing
                  },
                  {
                    label: "Delete",
                    action: () => {
                      handleShow();
                      setGetData(row);
                    },
                    isActive: true, // Assuming this is always active for editing
                  },
                ]}
              />
            </div>
          ),
        ]}
      />
    </>
  );
};

export default TableList;
