import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useCurrentUser = () => {
  const data = useQuery(api.users.current);

  const isLoading = data === undefined; // data is undefined measn it's still fetching so if its loading and data is undeinfed it's fetching

  return { data, isLoading };
};
