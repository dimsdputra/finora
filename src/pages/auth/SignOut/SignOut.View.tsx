import type { PropsWithChildren } from "react";
import { Button } from "../../../components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/Dialog";

interface SignOutViewProps {
  handleSignOut: () => void;
  isSignOutOpen: boolean;
  setIsSignOutOpen: (value: React.SetStateAction<boolean>) => void;
}

const SignOutView = (props: SignOutViewProps & PropsWithChildren) => {
  return (
    <Dialog open={props.isSignOutOpen} onOpenChange={props.setIsSignOutOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign Out</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={() => props.handleSignOut()} variant={"accent"}>
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignOutView;
