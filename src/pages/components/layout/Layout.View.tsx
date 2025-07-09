import type { PropsWithChildren } from "react";
import Menu from "../menu";
import { Label } from "../../../components/ui/Label";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useThemeStore } from "../../../store/themeStore";

const LayoutView = (props: PropsWithChildren) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <div className="fixed bottom-4 right-4 flex items-center space-x-2 z-50 opacity-50 hover:opacity-100 transition-opacity duration-300">
        <Label
          htmlFor="airplane-mode"
          onClick={toggleTheme}
          className="cursor-pointer"
        >
          {theme === "dark" ? (
            <MoonIcon className="w-5 h-5" />
          ) : (
            <SunIcon className="w-5 h-5" />
          )}
        </Label>
      </div>
      <Menu />
      <section className="w-full h-full sm:w-[calc(100vw-72px)] sm:ms-[72px]">{props.children}</section>
    </main>
  );
};

export default LayoutView;
