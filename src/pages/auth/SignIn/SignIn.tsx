import { useNavigate } from "react-router";
import SignInView from "./SignIn.View";
import { useForm } from "react-hook-form";
import type { SignInFormType } from "./sign-in-form-utils";
import { useState } from "react";
import {
  CreateUser,
  useSignInWithEmailAndPassword,
} from "../../../api/user.api";
import type { SignUpFormType } from "../SignUp/sign-up-form-utils";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../config/firebase-config";
import useLoading from "../../../hooks/useLoading";
import { toast } from "sonner";
import { useAuthStore, useLocationStore } from "../../../store/authStore";

const SignIn = () => {
  const navigate = useNavigate();
  const signing = useSignInWithEmailAndPassword();
  const googleProvider = new GoogleAuthProvider();
  const { setLoading } = useLoading();
  const { setUser } = useAuthStore();
  const { location } = useLocationStore();

  const signInForm = useForm<SignInFormType>({
    defaultValues: {},
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSignInWithEmail = (values: SignUpFormType) => {
    const { email, password } = values;
    if (!email || !password) {
      return;
    }
    signing.mutate({ email, password });
  };

  const handleSignInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      if (!!result.user.email && !!result.user.emailVerified) {
        if (!!result.user.uid) {
          CreateUser(result, setUser, location);
        }

        navigate("/dashboard");
        setLoading(false);
        toast("Sign in success", {
          description: `Welcome to FinOra ${result.user.displayName ?? ""}`,
        });
      } else {
        setLoading(false);
        toast("Sign in failed", {
          description: `email or password is incorrect, please try again.`,
        });
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <SignInView
      signInForm={signInForm}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      navigate={navigate}
      handleSignInWithEmail={handleSignInWithEmail}
      handleSignInWithGoogle={handleSignInWithGoogle}
    />
  );
};

export default SignIn;
