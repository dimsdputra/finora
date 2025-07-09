import {
  Bars3BottomRightIcon,
  PowerIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../../../components/ui/Button";
import { useEffect, useRef, useState, type JSX } from "react";
import LogoBase from "../../../assets/logo_base.png";
import type { NavigateFunction } from "react-router";
import { useMenuActionStore } from "../../../store/menuActionStore";
import SignOut from "../../auth/SignOut";
import classNames from "classnames";

type MenuViewProps = {
  navigate: NavigateFunction;
  dataMenu: {
    icon: JSX.Element;
    label: string;
    path: string;
  }[];
  isActive: (path: string) => boolean;
};

const MenuView = (props: MenuViewProps) => {
  const { isMenuOpen, toggleMenu, closeMenu, openMenu } = useMenuActionStore();

  const [isSignOutOpen, setIsSignOutOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Track mobile state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative h-full w-full cursor-pointer">
      {isMobile && (
        <Button
          variant="transparent"
          className={classNames(
            "fixed flex sm:hidden !-ml-[1px] top-5 right-4 group transition-all duration-300 border-none !bg-transparent rounded-md z-[9999]"
          )}
          aria-expanded={isMenuOpen ? "true" : "false"}
          onClick={() => toggleMenu()}
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-7 w-7 transition-transform duration-300 stroke-2 text-error" />
          ) : (
            <Bars3BottomRightIcon className="h-7 w-7 transition-transform duration-300 stroke-2 text-accent" />
          )}
        </Button>
      )}
      {/* Sidebar Menu */}
      <div
        className={classNames(
          "fixed top-0 left-0 z-[49] h-full w-fit transition-all duration-300",
          isMenuOpen
            ? "opacity-100 pointer-events-none bg-base-300 bg-opacity-50 w-full"
            : "opacity-100 pointer-events-none bg-transparent w-fit"
        )}
      >
        <div
          onMouseEnter={(e) =>
            !isMobile && e.target === e.currentTarget && openMenu()
          }
          onMouseLeave={(e) =>
            !isMobile &&
            !sidebarRef.current?.contains(e.relatedTarget as Node) &&
            closeMenu()
          }
          ref={sidebarRef}
          className={classNames(
            "h-full bg-base-100 duration-500 ease-in-out p-4 flex flex-col justify-between ",
            isMobile ? "transition-all" : "transition-[width]",
            isMenuOpen
              ? isMobile
                ? "w-fit pointer-events-auto"
                : "w-52 pointer-events-auto"
              : isMobile
              ? "opacity-0 pointer-events-none"
              : "w-[72px] pointer-events-auto",
            isSignOutOpen && "!pointer-events-none"
          )}
        >
          <div className="flex flex-col items-start gap-2">
            <div
              className={classNames(
                "flex items-end mb-5 w-full justify-center",
                isMenuOpen ? "gap-1" : "gap-0"
              )}
            >
              <div
                className={classNames(
                  "transition-all duration-500 translate-x-0"
                )}
              >
                <img
                  src={LogoBase}
                  alt="logo-finora"
                  className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
                />
              </div>
              <h1
                className={classNames(
                  "text-sm md:text-lg font-semibold text-base-content transition-[width] ease-in-out duration-500",
                  isMenuOpen ? "w-fit opacity-100" : "w-0 opacity-0"
                )}
              >
                Finora
              </h1>
            </div>
            {props.dataMenu.map((menuItem) => (
              <Button
                variant={
                  props.isActive(menuItem.path) ? "secondary" : "transparent"
                }
                className="w-full !justify-start"
                onClick={() => props.navigate(menuItem.path)}
                key={menuItem.label}
              >
                {menuItem.icon}
                <p
                  className={classNames(
                    "transition-all duration-500",
                    isMenuOpen ? "opacity-100" : "opacity-0"
                  )}
                >
                  {menuItem.label}
                </p>
              </Button>
            ))}
          </div>
          <SignOut
            isSignOutOpen={isSignOutOpen}
            setIsSignOutOpen={setIsSignOutOpen}
          >
            <Button
              onClick={() => {
                closeMenu();
                setIsSignOutOpen(true);
              }}
              variant="transparent"
              className="!p-0 text-sm hover:!bg-transparent justify-center w-full "
            >
              <PowerIcon className="stroke-[2.5]" />
            </Button>
          </SignOut>
        </div>
      </div>
    </div>
  );
};

export default MenuView;
