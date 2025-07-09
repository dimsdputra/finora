import type { UseFormReturn } from "react-hook-form";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/Avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { useAuthStore } from "../../../store/authStore";
import type { UserForm } from "./Setting";
import { SelectForm } from "../../../components/ui/MultiSelect";
import { Button } from "../../../components/ui/Button";

interface SettingViewProps {
  form: UseFormReturn<UserForm, any, UserForm>;
  handleSubmit: (data: UserForm) => void;
}

const SettingView = (props: SettingViewProps) => {
  const { user } = useAuthStore();

  const avatarFallback = user?.displayName
    ?.split(" ")
    ?.map((name) => name.charAt(0))
    ?.slice(0, 2)
    ?.join("");

  return (
    <section className="w-full h-full px-8 py-5 flex flex-col items-center gap-5">
      <h1 className="text-base font-semibold">Setting</h1>
      <form
        className="w-full max-w-3xl"
        onSubmit={props.form.handleSubmit(props.handleSubmit)}
      >
        <Card className="w-full px-0 md:px-6 py-12">
          <CardHeader>
            <div className="flex flex-col justify-center items-center">
              <Avatar className="w-14 h-14">
                <AvatarImage src={user?.photoURL ?? ""} alt="@shadcn" />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              <h2 className="text-xs font-semibold mt-2">
                {user?.displayName || "User Name"}
              </h2>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Input
              name="name"
              control={props.form.control}
              label="Name"
              placeholder="Enter name..."
              required
            />
            <Input
              name="bio"
              control={props.form.control}
              label="Bio"
              placeholder="Enter bio..."
            />
            <SelectForm
              name="currency"
              control={props.form.control}
              mode="single"
              label="Currency"
              placeholder="Select currency..."
              options={[
                { label: "USD", value: "USD", },
                { label: "EUR", value: "EUR", },
                { label: "GBP", value: "GBP", },
                { label: "JPY", value: "JPY", },
                { label: "IDR", value: "IDR", },
                { label: "INR", value: "INR", },
                { label: "SGD", value: "SGD", },
                { label: "MYR", value: "MYR", },
                { label: "KRW", value: "KRW", },
                { label: "CNY", value: "CNY", },
                { label: "AUD", value: "AUD", },
              ]}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant={"success"} type="submit">
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </section>
  );
};

export default SettingView;
