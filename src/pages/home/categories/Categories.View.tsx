import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import CategoriesIncome from "./components/CategoriesIncome";
import CategoriesExpense from "./components/CategoriesExpense";

interface CategoriesViewProps {
  activeTab: "income" | "expense";
  setActiveTab: React.Dispatch<React.SetStateAction<"income" | "expense">>;
}

const CategoriesView = (props: CategoriesViewProps) => {
  const tabsTrigger = ["income", "expense"];

  return (
    <section className="w-full h-full px-8 py-5">
      <Tabs defaultValue="income" value={props.activeTab}>
        <div className="w-full flex justify-center items-center">
          <TabsList className="w-full max-w-80">
            {tabsTrigger.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="capitalize"
                onClick={() => props.setActiveTab(tab as "income" | "expense")}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <CategoriesIncome />
        <CategoriesExpense />
      </Tabs>
    </section>
  );
};

export default CategoriesView;
