import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "../config/firebase-config";
import {
  useAuthStore,
  useLocationStore,
  type LocationStatetype,
} from "../store/authStore";
import useLoading from "../hooks/useLoading";
import { toast } from "sonner";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";
import { sanityReadClient, sanityWriteClient } from "../config/sanity.config";
import type { SanityDocument } from "@sanity/client";

interface SignupParams {
  email: string;
  password: string;
}

// utils/getLocationDetails.ts
export const getLocationDetails = async (lat: number, lon: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=3&addressdetails=1`,
    {
      headers: {
        "Accept-Language": "en", // optional: get results in English
        "User-Agent": "YourAppName/1.0 (your@email.com)", // required by Nominatim
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch location data");
  }

  return response.json();
};

export const useGetLocation = (
  latitude: number | null,
  longitude: number | null
) => {
  return useQuery<LocationDataType>({
    queryKey: ["locationDetails", latitude, longitude],
    queryFn: () => {
      if (latitude == null || longitude == null) {
        throw new Error("Latitude and Longitude are required");
      }
      return getLocationDetails(latitude, longitude);
    },
    enabled: latitude !== null && longitude !== null,
  });
};

export const useGetUserById = (userId: string | undefined) => {
  const { setLoading } = useLoading();
  const userQuery = `*[_type == "user" && userId == $userId]`;

  return useQuery<UserSettingDataType[]>({
    queryKey: ["users", userId],
    queryFn: async () => {
      setLoading(true);
      try {
        if (!userId) {
          return [];
        }
        const fetch = await sanityReadClient.fetch(userQuery, { userId });
        return fetch;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!userId,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    placeholderData: (prev) => prev,
  });
};

export const useSignUpWithEmailAndPassword = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  return useMutation({
    mutationFn: async ({ email, password }: SignupParams) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        return userCredential.user;
      } catch (error) {
        throw error; // Rethrow the error to be caught in onError
      }
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      setLoading(false);
      toast("Sign Up Success", {
        description: "Please login to continue",
        action: {
          label: <ArrowRightCircleIcon className="w-5 h-5" />,
          onClick: () => navigate("/auth/sign-in"),
        },
      });
    },
    onError: () => {
      setLoading(false);
      toast("Sign up failed", {
        description: `email already exists, please try again.`,
      });
    },
  });
};

export const CreateUser = async (
  userCredential: UserCredential,
  setUser: (
    user?:
      | (User & { _id: string | undefined; bio: string | undefined })
      | undefined
  ) => void,
  location: LocationStatetype | null
) => {
  const userQuery = `*[_type == "user" && userId == $userId]`;
  const user = userCredential.user;
  const getUser = await sanityReadClient.fetch(userQuery, {
    userId: user?.uid,
  });

  const doc = getUser?.[0];

  if (doc === undefined) {
    // If user setting does not exist, create it
    const createUser = await sanityWriteClient.create({
      _type: "user",
      userId: user?.uid,
      name: user.displayName ?? null,
      email: user.email,
      bio: null,
      currency: location?.currency ?? null,
      avatar: null,
    });

    if (createUser?._id) {
      setUser({
        ...userCredential?.user,
        _id: createUser._id,
        bio: createUser.bio ?? undefined,
      });
      return createUser;
    } else {
      setUser(undefined);
      signOut(auth);
      return "Failed to sign in";
    }
  } else {
    setUser({
      ...userCredential?.user,
      _id: doc._id,
      bio: doc.bio ?? undefined,
    });
    // If user already exists, update the user document
    return doc as SanityDocument;
  }
};

export const useSignInWithEmailAndPassword = () => {
  const { setUser } = useAuthStore();
  const { location } = useLocationStore();
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  return useMutation({
    mutationFn: async ({ email, password }: SignupParams) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (!!userCredential.user.uid) {
          return CreateUser(userCredential, setUser, location);
        } else {
          return userCredential?.user;
        }
      } catch (error) {
        console.error("Error signing in:", error);
        throw error; // Rethrow the error to be caught in onError
      }
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async (user) => {
      setLoading(false);
      const result = typeof user !== "string";

      if (result && (user as SanityDocument)?._id !== undefined) {
        navigate("/dashboard");
        toast("Sign in success", {
          description: `Welcome to FinOra ${
            (user as SanityDocument)?.name ?? ""
          }`,
        });
      } else {
        navigate("/");
        toast("Sign in failed");
      }
    },
    onError: (err) => {
      setLoading(false);
      toast("Sign in failed", {
        description: `email or password is incorrect, please try again.`,
      });
      console.error("Sign in error:", err);
    },
  });
};

export const useSignOut = () => {
  const { setUserClear } = useAuthStore();
  const { clearLocation } = useLocationStore();
  const { setLoading } = useLoading();

  return useMutation({
    mutationFn: async () => {
      try {
        const result = await signOut(auth);

        return result;
      } catch (error) {
        console.error("Error signing out:", error);
      }
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      setLoading(false);
      setUserClear();
      clearLocation();
      toast("Sign out success", {
        description: "You have successfully signed out.",
      });
    },
  });
};

export const useUpdateUserInfo = () => {
  const { setUser, user } = useAuthStore();
  const { setLocation } = useLocationStore();
  const { setLoading } = useLoading();

  return useMutation({
    mutationFn: async (userData: {
      bio: string | undefined;
      currency: Currency | undefined;
      displayName: string | undefined;
    }) => {
      try {
        const updatedUser = await sanityWriteClient
          .patch(user?._id ?? "")
          .set({
            bio: userData.bio,
            currency: userData.currency,
            name: userData.displayName,
          })
          .commit();

        if (updatedUser && user) {
          setUser({
            ...user,
            bio: userData.bio,
            displayName: userData.displayName as string,
          });
          setLocation({
            currency: userData.currency,
          });
        }

        return updatedUser;
      } catch (error) {
        console.error("Error updating user info:", error);
        throw error; // Rethrow the error to be caught in onError
      }
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      setLoading(false);
      toast("User info updated successfully");
    },
    onError: (error) => {
      setLoading(false);
      toast("Failed to update user info", {
        description: error.message,
      });
    },
  });
};
