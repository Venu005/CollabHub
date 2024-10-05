import React, { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useGetMessagesById } from "../api/useGetMessagesById";
import Message from "@/components/Message";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import { useGetCurrentMember } from "@/Features/members/api/useGetCurrentMember";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}
export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkSpaceId();
  const { data: currentMember } = useGetCurrentMember({ workspaceId });
  const { data: message, isLoading: isLoadingMessage } = useGetMessagesById({
    id: messageId,
  });
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  if (isLoadingMessage) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 border-b h-[49px]">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5] " />
          </Button>
        </div>
        <div>
          <div className="flex  h-full items-center justify-center">
            <Loader className="size-5 animate-spin  text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }
  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 border-b h-[49px]">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5] " />
          </Button>
        </div>
        <div>
          <div className="flex flex-col gap-y-2 h-full items-center justify-center">
            <AlertTriangle className="size-5  text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Message not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 border-b h-[49px]">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <XIcon className="size-5 stroke-[1.5] " />
        </Button>
      </div>
      <div>
        <Message
          hideThreadBtn
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === messageId}
          setEditingId={setEditingId}
        />
      </div>
    </div>
  );
};
