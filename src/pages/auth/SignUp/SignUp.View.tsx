import type { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import GoolgeIcon from "../../../assets/google_icon.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import type { NavigateFunction } from "react-router";
import Navbar from "../../../components/ui/Navbar";
import { SignUpFormType } from "../SignUp/sign-up-form-utils";

interface SignUpViewProps {
  signUpForm: UseFormReturn<SignUpFormType, any, SignUpFormType>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
  handleSignUpWithEmail: (values: SignUpFormType) => void;
  handleSignUpWithGoogle: () => Promise<void>;
}

const SignUpView = (props: SignUpViewProps) => {
  return (
    <>
      <Navbar />
      <section className="h-screen min-w-screen flex items-start justify-center max-h-[calc(100vh-76px)] mx-6 md:mx-0">
        <Card className="max-w-lg w-full px-0 md:px-6 py-12">
          <CardHeader>
            <CardDescription className="text-xs md:text-sm">
              Please enter your details
            </CardDescription>
            <CardTitle className="text-xl md:text-2xl">
              Welcome to FinOra
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Sign Up Form goes here */}
            <form
              className="space-y-4"
              onSubmit={props.signUpForm.handleSubmit(
                props.handleSignUpWithEmail
              )}
            >
              <Input
                name="email"
                label="Email"
                type="email"
                placeholder="Email"
                control={props.signUpForm.control}
                required
              />
              <Input
                name="password"
                label="Password"
                type={props.showPassword ? "text" : "password"}
                placeholder="Password"
                control={props.signUpForm.control}
                icon={
                  props.showPassword ? (
                    <EyeIcon
                      className="w-5 h-5"
                      onClick={() => props.setShowPassword((prev) => !prev)}
                    />
                  ) : (
                    <EyeSlashIcon
                      className="w-5 h-5"
                      onClick={() => props.setShowPassword((prev) => !prev)}
                    />
                  )
                }
                required
              />
              <div className="!mt-8 flex flex-col gap-4">
                <Button type="submit" variant={"neutral"} className="w-full">
                  Sign up
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  className="w-full"
                  onClick={props.handleSignUpWithGoogle}
                >
                  <img src={GoolgeIcon} alt="google icon" className="w-5 h-5" />
                  <p>Sign up with Google</p>
                </Button>
                <p className="text-xs text-base-content/70 text-center">
                  Already have an account?{" "}
                  <span
                    className="text-accent hover:underline cursor-pointer"
                    onClick={() => props.navigate("/auth/sign-in")}
                  >
                    Sign in
                  </span>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default SignUpView;
