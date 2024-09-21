import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetChannelByIdProps {
  id: Id<"channels">;
}

export const useGetChannelById = ({ id }: UseGetChannelByIdProps) => {
  const data = useQuery(api.channels.getById, { channelId: id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
