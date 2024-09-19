import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface useGetChannelsProps {
  id: Id<"workspaces">;
}

export const useGetChannels = ({ id }: useGetChannelsProps) => {
  const data = useQuery(api.channels.get, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
