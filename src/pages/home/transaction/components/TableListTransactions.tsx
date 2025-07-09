import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { Table } from "../../../../components/ui/Table";
import { FormatCurrency } from "../../../../helpers/currencyHelper";
import { format } from "date-fns";
import Tooltip from "../../../../components/ui/Tooltip";
import { useLocationStore } from "../../../../store/authStore";
import type { UseQueryParamsReturn } from "../../../../hooks/useQueryParams";
import { useGetCategories } from "../../../../api/categories.api";
import ActionMenu from "../../../components/actionMenu";
import type { UseDialogReturn } from "../../../../hooks/useDialog";
import {
  useDeleteExpenseMutation,
  useDeleteIncomeMutation,
} from "../../../../api/transaction.api";
import useDialog from "../../../../hooks/useDialog";
import ModalConfirmations from "../../../components/modal/ModalConfirmations";
import { useCallback, useState } from "react";

interface TableListTransactionsProps extends UseDialogReturn {
  activeTab: "income" | "expense";
  data: ResponseDataArray<TransactionsDataType> | undefined;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<
    QueryObserverResult<ResponseDataArray<TransactionsDataType>, Error>
  >;
  params: UseQueryParamsReturn;
  setDefaultData: React.Dispatch<
    React.SetStateAction<TransactionsDataType | undefined>
  >;
  filterYear: string;
}

const TableListTransactions = (props: TableListTransactionsProps) => {
  const { location } = useLocationStore();
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
        maxHeight="max-h-[390px]"
        searchField={["type", "category.categoryName"]}
        filterOptions={[
          {
            label: "Category",
            name: "category._id",
            type: "multiSelect",
            options:
              categories
                ?.filter((category) => category?.type === props.activeTab)
                ?.map((category) => ({
                  label: category.categoryName ?? "-",
                  value: category._id ?? "-",
                })) ?? [],
          },
        ]}
        refetch={props.refetch}
        data={props.data?.data}
        params={props.params}
        headers={[
          { name: "no", className: "w-[50px]" },
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
          (_, index) => index + 1,
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
            <div className="flex items-center justify-center">
              <ActionMenu
                menu={[
                  {
                    label: "Edit",
                    action: () => {
                      props.handleShow();
                      props.setDefaultData(row);
                    },
                    isActive: props.activeTab === "income",
                  },
                  {
                    label: "Edit",
                    action: () => {
                      props.handleShow();
                      props.setDefaultData(row);
                    },
                    isActive: props.activeTab === "expense",
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

export default TableListTransactions;
