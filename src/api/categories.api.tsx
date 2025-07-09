import { useQuery } from "@tanstack/react-query";
import useLoading from "../hooks/useLoading";
import { useAuthStore } from "../store/authStore";
import { sanityReadClient } from "../config/sanity.config";

export const useGetCategories = () => {
  const { user } = useAuthStore();
  const { setLoading } = useLoading();

  const categoriesQuery = `
    *[_type == "categories"] | order(categoryName asc)
  `;

  return useQuery<CategoriesDataType[]>({
    queryKey: ["categories", user?.uid],
    queryFn: async () => {
      setLoading(true);
      try {
        const fetch = await sanityReadClient.fetch(
          categoriesQuery,
          {},
          { useCdn: true }
        );

        return fetch;
      } catch (error) {
        console.error("Error fetching Categories:", error);
        throw new Error("Failed to fetch Categories");
      } finally {
        setLoading(false);
      }
    },
    enabled: !!user?.uid,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    placeholderData: (prev) => prev,
  });
};
