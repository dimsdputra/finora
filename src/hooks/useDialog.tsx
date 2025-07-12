import { useState, type JSX } from "react";
import { Dialog } from "../components/ui/Dialog";
import type { DialogProps } from "@radix-ui/react-dialog";

export interface UseDialogReturn {
    handleClose: () => void;
    handleShow: () => void;
    RenderDialog: (props: DialogProps) => JSX.Element;
    show?: boolean;
}

const useDialog = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const RenderDialog = ({ children, onOpenChange, ...props }: DialogProps) => {
    return (
      <Dialog
        open={show}
        onOpenChange={(e) => {
          setShow(e);
          onOpenChange?.(e);
        }}
        {...props}
      >
        {children}
      </Dialog>
    );
  };
  return { handleClose, handleShow, RenderDialog, show };
};

export default useDialog;
