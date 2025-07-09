import { useState } from "react";
import CategoriesView from "./Categories.View";

export type FilterCategory = {
  dates?: Date;
};

const Categories = () => {
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");

  return (
    <CategoriesView
      setActiveTab={setActiveTab}
      activeTab={activeTab}
    />
  );
};

export default Categories;
