import { useState } from "react";
import useDialog from "../../../hooks/useDialog";
import DashboardView from "./Dashboard.View";

const Dashboard = () => {
  const [defaultDataIncome, setDefaultDataIncome] = useState<
    TransactionsDataType | undefined
  >();

  const [defaultDataExpense, setDefaultDataExpense] = useState<
    TransactionsDataType | undefined
  >();

  const {
    RenderDialog: RenderDialogIncome,
    handleShow: handleShowIncome,
    handleClose: handleCloseIncome,
    show: showIncome,
  } = useDialog();

  const {
    RenderDialog: RenderDialogExpense,
    handleShow: handleShowExpense,
    handleClose: handleCloseExpense,
    show: showExpense,
  } = useDialog();

  return (
    <>
      <DashboardView
        dialogIncome={{
          RenderDialog: RenderDialogIncome,
          handleShow: handleShowIncome,
          handleClose: handleCloseIncome,
          show: showIncome,
        }}
        dialogExpense={{
          RenderDialog: RenderDialogExpense,
          handleShow: handleShowExpense,
          handleClose: handleCloseExpense,
          show: showExpense,
        }}
        defaultDataIncome={defaultDataIncome}
        setDefaultDataIncome={setDefaultDataIncome}
        defaultDataExpense={defaultDataExpense}
        setDefaultDataExpense={setDefaultDataExpense}
      />
    </>
  );
};

export default Dashboard;
