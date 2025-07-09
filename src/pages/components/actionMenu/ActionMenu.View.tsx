import type { ActionMenuProps } from "./ActionMenu";
import {
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../components/ui/DropdownMenu";

const ActionMenuView = ({
  align = "horizontal",
  ...props
}: ActionMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {align === "horizontal" ? (
          <EllipsisHorizontalIcon className="w-4 h-4 text-base-content cursor-pointer" />
        ) : (
          <EllipsisVerticalIcon className="w-4 h-4 text-base-content cursor-pointer" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-52 !px-0">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuGroup>
          {props.menu
            ?.filter((item) => item.isActive === true)
            ?.map((item, index) => (
              <DropdownMenuItem key={index} onClick={() => item.action()}>
                {item.label}
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionMenuView;
