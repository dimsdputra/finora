import type { PropsWithChildren } from "react";
import { type UseDialogReturn } from "../../../hooks/useDialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

interface ModalConfirmationsProps extends UseDialogReturn, PropsWithChildren {
  title: string;
  description: string;
  handleSave: () => void;
  type?: "info" | "success" | "warning" | "error";
  confirmTitle?: string;
}

const ModalConfirmations = ({
  RenderDialog,
  handleClose,
  handleShow,
  type = "info",
  ...props
}: ModalConfirmationsProps) => {
  const getColors = () => {
    switch (type) {
      case "info":
        return "stroke-info";
      case "success":
        return "stroke-success";
      case "warning":
        return "stroke-warning";
      case "error":
        return "stroke-error";
      default:
        return "stroke-info";
    }
  };

  return (
    <RenderDialog>
      <DialogTrigger asChild className="w-full">
        {props.children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] !gap-8">
        <DialogHeader className="items-center gap-5">
          <InformationCircleIcon
            className={classNames("w-10 h-10", getColors())}
          />
          <DialogTitle className="text-center text-sm">
            {props.title}
          </DialogTitle>
          <DialogDescription className="text-center text-xs">
            {props.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="!justify-center">
          <Button
            variant="error"
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={() => {
              props.handleSave();
              handleClose();
            }}
          >
            {props.confirmTitle ?? "Yes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RenderDialog>
  );
};

export default ModalConfirmations;
