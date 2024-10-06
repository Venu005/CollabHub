import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetMembersByIdProps {
  memberId: Id<"members">;
}
export const useGetMembersById = ({ memberId }: useGetMembersByIdProps) => {
  const data = useQuery(api.members.getById, { id: memberId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
