import type { User } from "firebase/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: (Partial<User> & { _id?: string; bio?: string }) | undefined;
  setUser: (user?: Partial<User> & { _id?: string; bio?: string }) => void;
  setUserClear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user) =>
        set((prev) => ({
          user: { ...prev.user, ...user }, // merge prev user with new user fields
        })),
      setUserClear: () => set((prev) => ({ user: undefined })),
    }),
    {
      name: "user-auth", // key in localStorage
      partialize: (state) => ({ user: state.user }), // only persist the user
    }
  )
);

interface SettingsState {
  setting: UserSettingDataType | null;
  setSetting: (setting: UserSettingDataType) => void;
  clearSetting: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      setting: null,
      setSetting: (setting) => set((state) => ({ ...state, setting })),
      clearSetting: () => set({ setting: null }),
    }),
    {
      name: "settings", // name in localStorage
    }
  )
);

export interface LocationStatetype {
  latitude?: number;
  longitude?: number;
  currency?: Currency;
}

interface LocationState {
  location: LocationStatetype | null;
  setLocation: (location: LocationStatetype | null) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: null,
      setLocation: (location) => set((state) => ({ ...state, location })),
      clearLocation: () => set({ location: null }),
    }),
    {
      name: "location", // name in localStorage
    }
  )
);
