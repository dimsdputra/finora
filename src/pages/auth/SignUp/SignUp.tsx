import { useForm } from "react-hook-form";
import SignUpView from "./SignUp.View";
import type { SignUpFormType } from "./sign-up-form-utils";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  CreateUser,
  useSignUpWithEmailAndPassword,
} from "../../../api/user.api";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import useLoading from "../../../hooks/useLoading";
import { useAuthStore, useLocationStore } from "../../../store/authStore";
import { auth } from "../../../config/firebase-config";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const signing = useSignUpWithEmailAndPassword();
  const googleProvider = new GoogleAuthProvider();
  const { setLoading } = useLoading();
  const { setUser } = useAuthStore();
  const { location } = useLocationStore();

  const signUpForm = useForm<SignUpFormType>({
    defaultValues: {},
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSignUpWithEmail = (values: SignUpFormType) => {
    const { email, password } = values;
    if (!email || !password) {
      return;
    }
    signing.mutate({ email, password });
  };

  const handleSignUpWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      if (!!result.user.email && !!result.user.emailVerified) {
        if (!!result.user.uid) {
          CreateUser(result, setUser, location);
        }

        navigate("/dashboard");
        setLoading(false);
        toast("Sign up success", {
          description: `Welcome to FinOra ${result.user.displayName ?? ""}`,
        });
      } else {
        setLoading(false);
        toast("Sign up failed", {
          description: `email or password is incorrect, please try again.`,
        });
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <SignUpView
      signUpForm={signUpForm}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      navigate={navigate}
      handleSignUpWithEmail={handleSignUpWithEmail}
      handleSignUpWithGoogle={handleSignUpWithGoogle}
    />
  );
};

export default SignUp;
