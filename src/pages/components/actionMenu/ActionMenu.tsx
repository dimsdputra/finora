import ActionMenuView from "./ActionMenu.View";

export interface ActionMenuProps {
  menu: { label: string; action: () => void; isActive: boolean }[];
  align?: "vertical" | "horizontal";
}

const ActionMenu = (props: ActionMenuProps) => {
  return <ActionMenuView {...props} />;
};

export default ActionMenu;
