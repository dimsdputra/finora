import { useState, useMemo } from "react";
import useDebounce from "./useDebounce";
import { endOfMonth, formatISO, startOfMonth } from "date-fns";

type SearchInput = {
  field?: string[];
  value?: string;
};

type FilterInput = {
  [key: string]:
    | string
    | number
    | string[]
    | number[]
    | Date
    | {
        [nestedKey: string]:
          | string
          | number
          | string[]
          | number[]
          | { from?: Date; to?: Date };
      };
};

type OrderInput = {
  [key: string]: "asc" | "desc";
};

export type UseQueryParamsReturn = {
  search: SearchInput | undefined;
  setSearch: React.Dispatch<React.SetStateAction<SearchInput | undefined>>;
  filters: FilterInput;
  setFilters: React.Dispatch<React.SetStateAction<FilterInput>>;
  order: OrderInput;
  setOrder: React.Dispatch<React.SetStateAction<OrderInput>>;
  perPage: number;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalData: number;
  setTotalData: React.Dispatch<React.SetStateAction<number>>;
  filterString: string;
  searchString: string;
  filterQueryParams: string;
  searchQueryParams: string;
  orderQueryParams: string;
  pagination: {
    totalPages: number;
    currentPage: number;
    paginationQuery: string;
  };
};

/**
 * Hook to manage search, filters, pagination + build Algolia filter string.
 */
export function useQueryParams(): UseQueryParamsReturn {
  const [search, setSearch] = useState<SearchInput | undefined>();
  const [filters, setFilters] = useState<FilterInput>({});
  const [order, setOrder] = useState<OrderInput>({});
  const [perPage, setPerPage] = useState(50);
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const debouncedSearch = useDebounce(search, 500);

  const filterString = useMemo(() => {
    const parts: string[] = [];

    for (const key in filters) {
      const val = filters[key];

      if (
        Array.isArray(val) &&
        val.length > 0 &&
        (typeof val[0] === "number" || typeof val[0] === "string")
      ) {
        let arrayValues: (string | number)[] = [];
        val.forEach((value) => {
          arrayValues.push(`${key} == ${JSON.stringify(value)}`);
        });
        parts.push(`(${arrayValues.join(" || ")})`);
      } else if (val instanceof Date) {
        parts.push(
          `${key} >= "${formatISO(
            startOfMonth(val)
          )}" && ${key} <= "${formatISO(endOfMonth(val))}"`
        );
      }
      // Handle nested object: { nestedKey: value }
      else if (typeof val === "object" && !Array.isArray(val)) {
        // Handle {from, to} in nested object (date/number range)
        if ("from" in val || "to" in val) {
          const valDate = val as { from?: Date; to?: Date };
          if (valDate.from !== undefined && valDate.to !== undefined) {
            parts.push(
              `${key} >= "${valDate.from.toISOString()}" && ${key} <= "${valDate.to.toISOString()}"`
            );
          } else if (valDate.from !== undefined) {
            parts.push(`${key} >= "${valDate.from.toISOString()}"`);
          } else if (valDate.to !== undefined) {
            parts.push(`${key} <= "${valDate.to.toISOString()}"`);
          }
        } else {
          // Handle nested object: { nestedKey: value }
          for (const nestedKey in val) {
            const nestedVal = (
              val as {
                [nestedKey: string]:
                  | string
                  | number
                  | string[]
                  | number[]
                  | { from?: Date; to?: Date };
              }
            )[nestedKey];

            if (nestedVal === undefined) continue;

            if (Array.isArray(nestedVal)) {
              let arrayValues: (string | number)[] = [];
              nestedVal.forEach((value) => {
                arrayValues.push(
                  `${key}->${nestedKey} == ${JSON.stringify(value)}`
                );
              });
              parts.push(`(${arrayValues.join(" || ")})`);
            } else {
              parts.push(
                `${key}->${nestedKey} == ${JSON.stringify(nestedVal)}`
              );
            }
          }
        }
      }
      // else if (typeof val === "object" && !Array.isArray(val)) {
      //   for (const nestedKey in val) {
      //     const nestedVal = (
      //       val as {
      //         [nestedKey: string]:
      //           | string
      //           | number
      //           | string[]
      //           | number[]
      //           | { from?: Date; to?: Date };
      //       }
      //     )[nestedKey];

      //     if (nestedVal === undefined) continue;

      //     // Handle {from, to} in nested object
      //     if ("from" in val || "to" in val) {
      //       const valDate = val as { from?: Date; to?: Date };
      //       if (valDate.from !== undefined && valDate.to !== undefined) {
      //         parts.push(
      //           `${key} >= "${valDate.from.toISOString()}" && ${key} <= "${valDate.to.toISOString()}"`
      //         );
      //       } else if (valDate.from !== undefined) {
      //         parts.push(`${key} >= "${valDate.from.toISOString()}"`);
      //       } else if (valDate.to !== undefined) {
      //         parts.push(`${key} <= "${valDate.to.toISOString()}"`);
      //       }
      //     } else {
      //       if (Array.isArray(nestedVal)) {
      //         let arrayValues: (string | number)[] = [];
      //         nestedVal.forEach((value) => {
      //           arrayValues.push(
      //             `${key}->${nestedKey} == ${JSON.stringify(value)}`
      //           );
      //         });
      //         parts.push(`(${arrayValues.join(" || ")})`);
      //       } else {
      //         parts.push(
      //           `${key}->${nestedKey} == ${JSON.stringify(nestedVal)}`
      //         );
      //       }
      //     }
      //   }
      // }
      // Handle string or number
      else if (typeof val === "string" || typeof val === "number") {
        parts.push(`${key} == ${JSON.stringify(val)}`);
      }
    }

    return parts.join(" && ");
  }, [filters]);

  const searchString = useMemo(() => {
    if (
      !debouncedSearch ||
      !debouncedSearch.field?.length ||
      !debouncedSearch.value
    )
      return "";

    const value = debouncedSearch.value;
    const parts = debouncedSearch.field.map((f) => {
      if (f.includes(".")) {
        const [key, subKey] = f.split(".");
        return `${key}->${subKey} match "${value}*"`;
      }
      return `${f} match "${value}*"`;
    });

    return parts.join(" || ");
  }, [debouncedSearch]);

  const orderString = useMemo(() => {
    if (!order || Object.keys(order).length === 0) return "";
    return Object.entries(order)
      .map(([key, value]) => `${key} ${value}`)
      .join(", ");
  }, [order]);

  // Calculate start and end indices for pagination
  // page is 0-based (page 0 = first page)
  const { start, end } = useMemo(() => {
    if (page === 0 || totalData === 0) return { start: 0, end: perPage };

    const start = (page - 1) * perPage;
    let end = start + perPage;
    return { start, end };
  }, [page, perPage, totalData]);

  const totalPages = useMemo(() => {
    if (!totalData || totalData <= 0) return 1;
    return Math.ceil(totalData / perPage);
  }, [totalData, perPage]);

  // Optionally, clamp page to valid range
  const currentPage = Math.min(page, totalPages ?? 1);

  const paginationQuery = useMemo(() => {
    return `[${start}...${end}]`;
  }, [start, end]);

  return {
    search,
    setSearch,
    filters,
    setFilters,
    order,
    setOrder,
    perPage,
    setPerPage,
    page,
    setPage,
    setTotalData,
    totalData,
    filterString,
    searchString,
    filterQueryParams: filterString ? ` && ${filterString}` : "",
    searchQueryParams: searchString ? ` && (${searchString})` : "",
    orderQueryParams: orderString ? `${orderString}` : `_createdAt desc`,
    pagination: {
      totalPages,
      currentPage,
      paginationQuery: paginationQuery ? ` ${paginationQuery}` : "",
    },
  };
}
