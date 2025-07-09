import { useState, type JSX } from "react";
import { Dialog } from "../components/ui/Dialog";
import type { DialogProps } from "@radix-ui/react-dialog";

export interface UseDialogReturn {
    handleClose: () => void;
    handleShow: () => void;
    RenderDialog: (props: DialogProps) => JSX.Element;
}

const useDialog = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const RenderDialog = ({ children, onOpenChange, ...props }: DialogProps) => {
    return (
      <Dialog
        open={show}
        onOpenChange={() => {
          setShow((prev) => !prev);
          onOpenChange?.(show);
        }}
        {...props}
      >
        {children}
      </Dialog>
    );
  };
  return { handleClose, handleShow, RenderDialog };
};

export default useDialog;
