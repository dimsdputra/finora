import type { Timestamp } from "firebase/firestore";

declare global {
  interface ResponseDataArray<T> {
    data: T[];
    total: number;
  }

  interface ResponseDataObject<T> {
    data: T;
  }

  interface CategoriesDataType {
    _id?: string;
    _createdAt?: Date;
    _updatedAt?: Date;
    categoryName?: string;
    type?: string;
    description?: string;
  }

  interface MonthlyBalancesDataType {
    _id?: string;
    userId?: string;
    year?: number;
    month?: number;
    amountIncome?: number;
    amountExpense?: number;
    _createdAt?: Date;
    _updatedAt?: Date;
  }

  interface TransactionsDataType {
    _id?: string;
    _createdAt?: Date;
    _updatedAt?: Date;
    amount?: number;
    date?: Date;
    category?: {
      _id?: string;
      categoryName?: string;
    };
    description?: string;
    type?: string;
    user?: {
      _id?: string;
      currency?: string;
      name?: string;
      userId?: string;
    };
  }

  interface SettingsDataType {
    _id?: string;
    userId?: string;
    currency?: string;
    avatar?: string;
    bio?: string;
    name?: string;
    _createAt?: Date;
    _updatedAt?: Date;
  }

  type Currency =
    | "IDR"
    | "USD"
    | "EUR"
    | "JPY"
    | "KRW"
    | "SGD"
    | "CNY"
    | "INR"
    | "MYR"
    | "AUD"
    | "GBP";

  interface UserSettingDataType {
    id?: string;
    userId?: string;
    avatar?: string | null;
    bio?: string | null;
    name?: string | null;
    currency?: Currency;
    createAt?: Timestamp;
    updatedAt?: Date | null;
  }

  interface LocationDataType {
    address?: {
      borough?: string;
      city?: string;
      country?: string;
      country_code?: string;
      historic?: string;
      house_number?: string;
      neighbourhood?: string;
      postcode?: string;
      road?: string;
      suburb?: string;
    };
    boundingbox?: string[];
    class?: string;
    display_name?: string;
    importance?: number;
    lat?: string;
    licence?: string;
    lon?: string;
    osm_id?: number;
    osm_type?: string;
    place_id?: number;
    svg?: string;
    type?: string;
  }
}

export {};
