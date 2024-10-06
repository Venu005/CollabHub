import React from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useMemberId } from "@/hooks/useMemberId";
import { useGetMembersById } from "@/Features/members/api/useGetMembersById";
import { useGetMessage } from "@/Features/messages/api/useGetMessage";
import { Loader } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./ChatInput";
import { MessageList } from "@/components/MessageList";
import { usePanel } from "@/hooks/usePanel";

interface ConversationProps {
  id: Id<"conversations">;
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const { onOpenProfile } = usePanel();
  //prettier-ignore
  const {data : member, isLoading:isLoadingMember} = useGetMembersById({ memberId });
  const { results, status, loadMore } = useGetMessage({ conversationId: id });
  if (isLoadingMember || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => onOpenProfile(memberId)}
      />
      <MessageList
        data={results}
        variant="conversation"
        memberImage={member?.user.image}
        memberName={member?.user.name}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  );
};
