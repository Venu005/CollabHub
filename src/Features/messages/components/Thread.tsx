import React, { useRef, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useGetMessagesById } from "../api/useGetMessagesById";
import Message from "@/components/Message";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import { useGetCurrentMember } from "@/Features/members/api/useGetCurrentMember";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useCreateMessage } from "../api/useCreateMessage";
import { useGenUploadUrl } from "@/Features/upload/api/useGenUploadUrl";
import { toast } from "sonner";
import { useChannelId } from "@/hooks/useChannelId";
import { useGetMessage } from "../api/useGetMessage";
import { differenceInMinutes, isToday, isYesterday, format } from "date-fns";
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });
interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}
const TIME_THRESHOLD = 5;
export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkSpaceId();
  const channelId = useChannelId();
  const { data: currentMember } = useGetCurrentMember({ workspaceId });
  const { data: message, isLoading: isLoadingMessage } = useGetMessagesById({
    id: messageId,
  });
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenUploadUrl();

  const { results, status, loadMore } = useGetMessage({
    channelId,
    parentMessageId: messageId,
  });
  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  type CreateMessageValues = {
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
    parentMessageId: Id<"messages">;
    body: string;
    image: Id<"_storage"> | undefined;
  };
  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);
      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };
      // if user uploads any image
      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) {
          throw new Error("Failed to generate upload url");
        }
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });
        if (!result.ok) {
          throw new Error("Failed to upload image");
        }
        const { storageId } = await result.json();
        values.image = storageId;
      }

      await createMessage(values, {
        throwError: true,
      });
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message ");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d");
  };
  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = []; // mo messages on that date
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>
  );
  if (isLoadingMessage || status === "LoadingFirstPage") {
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
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {/* reply to message */}

        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, indx) => {
              const prevMessage = messages[indx - 1];
              const isCompact =
                prevMessage &&
                prevMessage.user._id === message.user._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(prevMessage._creationTime)
                ) < TIME_THRESHOLD;
              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  isAuthor={message.memberId === currentMember?._id}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadBtn
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadTimestamp={message.threadTimestamp}
                />
              );
            })}
          </div>
        ))}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 }
              );
              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />
        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}
        {/* this is the main message */}
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
      <div className="px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          disabled={isPending}
          innerRef={editorRef}
          placeholder="Reply.."
        />
      </div>
    </div>
  );
};
