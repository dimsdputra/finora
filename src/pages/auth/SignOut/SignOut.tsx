import type { PropsWithChildren } from "react";
import { useSignOut } from "../../../api/user.api";
import SignOutView from "./SignOut.View";

const SignOut = (
  props: PropsWithChildren & {
    isSignOutOpen: boolean;
    setIsSignOutOpen: (value: React.SetStateAction<boolean>) => void;
  }
) => {
  const signOut = useSignOut();

  const handleSignOut = () => {
    signOut.mutate();
  };

  return <SignOutView handleSignOut={handleSignOut} {...props} />;
};

export default SignOut;
