import { useForm } from "react-hook-form";
import SettingView from "./Setting.View";
import { useAuthStore, useLocationStore } from "../../../store/authStore";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useUpdateUserInfo } from "../../../api/user.api";

export type UserForm = {
  name?: string;
  bio?: string;
  currency?: Currency[];
};

const SettingSchema: Yup.ObjectSchema<UserForm> = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  bio: Yup.string().optional(),
  currency: Yup.array()
    .of(Yup.mixed<Currency>().required("Currency is required"))
    .min(1, "Currency is required")
    .required("Currency is required")
    .typeError("Currency is required"),
});

const Setting = () => {
  const { user } = useAuthStore();
  const { location } = useLocationStore();
  const userForm = useForm<UserForm>({
    defaultValues: {
      name: user?.displayName || "",
      bio: user?.bio || "",
      currency: [location?.currency],
    },
    resolver: yupResolver(SettingSchema),
  });

  const update = useUpdateUserInfo();

  const handleSubmit = (data: UserForm) => {
    update.mutate({
      bio: data.bio,
      currency: data?.currency?.[0],
      displayName: data.name,
    });
  };

  return <SettingView form={userForm} handleSubmit={handleSubmit} />;
};

export default Setting;
