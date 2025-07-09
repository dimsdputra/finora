import type { TippyProps } from "@tippyjs/react";
import Tippy from "@tippyjs/react";
import { useEffect, useState, type FC } from "react";
import { useThemeStore } from "../../store/themeStore";

interface TooltipProps extends TippyProps {}

const useIsMobile = (breakpoint = 640) => {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

const Tooltip: FC<TooltipProps> = ({ children, ...props }) => {
  const { theme } = useThemeStore();
  const isMobile = useIsMobile();
  
  return (
    <Tippy
      animation="shift-away-subtle"
      trigger={isMobile ? "click" : "mouseenter focus"}
      theme={theme === "light" ? "accent" : "accent-dark"}
      {...props}
    >
      {children}
    </Tippy>
  );
};

export default Tooltip;
