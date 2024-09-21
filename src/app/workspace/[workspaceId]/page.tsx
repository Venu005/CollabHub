/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useGetChannels } from "@/Features/channels/api/useGetChannels";
import { useCreateChannelModal } from "@/Features/channels/store/useCreateChannelModal";
import { useGetCurrentMember } from "@/Features/members/api/useGetCurrentMember";
import { useGetWOrkSpace } from "@/Features/workspaces/api/useGetWorkSpace";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { useEffect, useMemo } from "react";

// interface WorkspaceIdPageProps {
//   params: {
//     workspaceId: string;
//   };
// }

const Page = () => {
  const workspaceId = useWorkSpaceId();
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();
  const { data: workSpaceData, isLoading: workSpaceLoading } = useGetWOrkSpace({
    id: workspaceId,
  });
  const { data: channels, isLoading: isLoadingChannels } = useGetChannels({
    id: workspaceId,
  });

  const { data: currMember, isLoading: loadingCurrMember } =
    useGetCurrentMember({ workspaceId });

  const isAdmin = useMemo(
    () => currMember?.role === "admin",
    [currMember?.role]
  );

  const channelId = useMemo(() => channels?.[0]._id, [channels]);

  useEffect(() => {
    if (
      workSpaceLoading ||
      isLoadingChannels ||
      !workSpaceData ||
      !currMember ||
      loadingCurrMember
    ) {
      return;
    }
    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      // if all channels are deleted then prompt user to enter a new channel
      setOpen(true);
    }
  }, [
    workSpaceData,
    channelId,
    workSpaceLoading,
    isLoadingChannels,
    router,
    open,
    setOpen,
    workspaceId,
    currMember,
    loadingCurrMember,
    isAdmin,
  ]);

  if (workSpaceData || isLoadingChannels) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!workSpaceData) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">CHannel not found</span>
    </div>
  );
};

export default Page;
