import { useEffect, type PropsWithChildren } from "react";
import { useAuthStore, useLocationStore } from "../../store/authStore";
import { useLocation, useNavigate } from "react-router";
import { getLocationDetails, useGetUserById } from "../../api/user.api";
import { getCurrency } from "../../helpers/locationHelpers";
import { useQuery } from "@tanstack/react-query";

const AuthInit = ({ children }: PropsWithChildren) => {
  const { user, setUser } = useAuthStore();
  const { setLocation, location } = useLocationStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { data } = useQuery<LocationDataType>({
    queryKey: ["locationDetails", location?.latitude, location?.longitude],
    queryFn: () => {
      if (location?.latitude == null || location?.longitude == null) {
        throw new Error("Latitude and Longitude are required");
      }
      return getLocationDetails(location?.latitude, location?.longitude);
    },
    enabled:
      location?.latitude !== null &&
      location?.longitude !== null &&
      location?.currency === undefined,
  });

  const { data: userData } = useGetUserById(user?.uid);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!location) {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              currency: undefined,
            });
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  }, [location]);

  useEffect(() => {
    if (location && data && !location.currency) {
      setLocation({
        ...location,
        currency: getCurrency(
          (data.address?.country_code ?? "us")?.toUpperCase()
        ),
      });
    }
  }, [location, data]);

  useEffect(() => {
    if (user?.uid && userData && userData.length > 0) {
      const userInfo = userData[0];
      setUser({
        displayName: userInfo.name ?? "",
        bio: userInfo.bio ?? "",
      });
      setLocation({
        ...location,
        currency: userInfo.currency,
      });
    }
  }, [userData, user?.uid]);

  useEffect(() => {
    if (
      user === undefined &&
      pathname !== "/auth/sign-in" &&
      pathname !== "/auth/sign-up"
    ) {
      // If user is not authenticated, redirect to sign-in page
      navigate("/auth/sign-in");
    } else if (
      user &&
      (pathname === "/auth/sign-in" || pathname === "/auth/sign-up")
    ) {
      // If user is authenticated and trying to access auth pages, redirect to home
      navigate("/dashboard");
    }
  }, [user, pathname]);

  return <>{children}</>;
};

export default AuthInit;
