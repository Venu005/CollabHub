// hook for workspaces api
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkSpaceIdProps {
  id: Id<"workspaces">;
}

export const useGetWOrkSpace = ({ id }: UseGetWorkSpaceIdProps) => {
  const data = useQuery(api.workspaces.getById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
