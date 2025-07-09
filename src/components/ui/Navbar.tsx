import { useNavigate } from "react-router-dom";
import LogoDark from "../../assets/logo_dark.png";
import LogoLight from "../../assets/logo_light.png";
import { useThemeStore } from "../../store/themeStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  return (
    <div className="px-10 pt-6 pb-6">
      <div
        className="flex items-start justify-center gap-2 hover:cursor-pointer w-full"
        onClick={() => navigate("/")}
      >
        <img
          src={theme === "light" ? LogoDark : LogoLight}
          alt="logo"
          className="w-16 h-16 sm:w-20 sm:h-20 md:h-24 md:w-24"
        />
      </div>
    </div>
  );
};

export default Navbar;
