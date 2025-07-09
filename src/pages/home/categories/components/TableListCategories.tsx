import { Table } from "../../../../components/ui/Table";
import { FormatCurrency } from "../../../../helpers/currencyHelper";
import { useLocationStore } from "../../../../store/authStore";
import { format } from "date-fns";
import Tooltip from "../../../../components/ui/Tooltip";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import ActionMenu from "../../../components/actionMenu";
import type { UseDialogReturn } from "../../../../hooks/useDialog";
import useDialog from "../../../../hooks/useDialog";
import { useCallback, useState } from "react";
import {
  useDeleteExpenseMutation,
  useDeleteIncomeMutation,
} from "../../../../api/transaction.api";
import ModalConfirmations from "../../../components/modal/ModalConfirmations";

const TableListCategories = ({
  categoryData,
  ...props
}: {
  activeTab: "income" | "expense";
  categoryData: TransactionsDataType[] | undefined;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<TransactionsDataType[], Error>>;
  setDefaultData: React.Dispatch<
    React.SetStateAction<TransactionsDataType | undefined>
  >;
  filterYear: string;
} & UseDialogReturn) => {
  const { location } = useLocationStore();

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
        data={categoryData ?? []}
        headers={[
          { name: "no", className: "w-[50px]" },
          { name: "Amount", sortable: true, sortKey: "amount" },
          { name: "Date", sortable: true, sortKey: "date" },
          { name: "Description", sortable: true, sortKey: "description" },
          { name: "Last Edited", sortable: true, sortKey: "_updatedAt" },
          { name: "Action", className: "text-center" },
        ]}
        renderers={[
          (_, index) => index + 1,
          (row) => FormatCurrency(row.amount ?? 0, location?.currency),
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
                      props.handleShow();
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

export default TableListCategories;
