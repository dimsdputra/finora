import { useLocation } from "react-router";
import HomeView from "./Home.View";
import Dashboard from "./dashboard";
import Transaction from "./transaction";
import Categories from "./categories";
import Setting from "./setting";
import { useCallback } from "react";

type PageType = "dashboard" | "transaction" | "category" | "setting";

const Home = () => {
  const { pathname } = useLocation();
  const page: PageType = pathname.split("/")[1] as PageType;

  const RenderPage = useCallback(() => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "transaction":
        return <Transaction />;
      case "category":
        return <Categories />;
      case "setting":
        return <Setting />;
      default:
        return <Dashboard />;
    }
  }, [page]);

  return <HomeView RenderPage={RenderPage} />;
};

export default Home;
