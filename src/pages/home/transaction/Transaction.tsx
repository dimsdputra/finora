import { useState } from "react";
import TransactionView from "./Transaction.View";

const Transaction = () => {
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");

  return <TransactionView activeTab={activeTab} setActiveTab={setActiveTab} />;
};

export default Transaction;
