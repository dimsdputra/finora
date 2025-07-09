import {
  BanknotesIcon,
  Cog6ToothIcon,
  HomeModernIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import MenuView from "./Menu.View";
import { useLocation, useNavigate } from "react-router";

const Menu = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = (path: string) => `/${pathname?.split("/")?.[1]}` === path;

  const dataMenu = [
    { icon: <HomeModernIcon className="stroke-[2]" />, label: "Dashboard", path: "/dashboard" },
    { icon: <BanknotesIcon className="stroke-[2]" />, label: "Transaction", path: "/transaction" },
    { icon: <RectangleStackIcon className="stroke-[2]" />, label: "Category", path: "/category" },
    { icon: <Cog6ToothIcon className="stroke-[2]" />, label: "Setting", path: "/setting" },
  ];

  return (
    <MenuView navigate={navigate} dataMenu={dataMenu} isActive={isActive} />
  );
};

export default Menu;
