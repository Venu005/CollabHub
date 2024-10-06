"use client";
import { useGetOrCreateConvo } from "@/Features/conversations/api/useGetOrCreateConvo";
import { useMemberId } from "@/hooks/useMemberId";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import { AlertTriangle, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversation } from "./Conversation";

const MemberIdPage = () => {
  const workspaceId = useWorkSpaceId();
  const memberId = useMemberId();
  //prettier-ignore
  const [conversationId, setConversationId] =  useState< Id<'conversations'> |null>(null)
  const { mutate, isPending } = useGetOrCreateConvo();
  useEffect(() => {
    mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess(data) {
          setConversationId(data);
        },
        onError() {
          toast.error("Failed to load or create conversation");
        },
      }
    );
  }, [memberId, workspaceId, mutate]);

  if (isPending) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="h-full flex flex-col gap-y-2 items-center justify-center ">
        <AlertTriangle className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Conversation not found
        </span>
      </div>
    );
  }

  return <Conversation id={conversationId} />;
};

export default MemberIdPage;
