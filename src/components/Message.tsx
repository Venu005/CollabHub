import dynamic from "next/dynamic";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Thumbnail from "./Thumbnail";
import { ToolbarReaction } from "./ToolbarReaction";
import { useUpdateMessage } from "@/Features/messages/api/useUpdateMessage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDeleteMessage } from "@/Features/messages/api/useDeleteMessage";
import { useConfirm } from "@/hooks/useConfirmation";
import { useToggleReactions } from "@/Features/reactions/api/useToggleReactions";
import { Reactions } from "./Reactions";
import { usePanel } from "@/hooks/usePanel";
import { ThreadBar } from "./ThreadBar";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorName?: string;
  authorImage?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadBtn?: boolean;
  threadCount?: number;
  threadName?: string;
  threadImage?: string;
  threadTimestamp?: number;
}

const formateFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

const Message = ({
  id,
  isAuthor,
  memberId,
  authorImage,
  authorName = "Member",
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadBtn,
  threadCount,
  threadName,
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  const { parentMessageId, onOpenMessage, onCloseMessage } = usePanel();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete message",
    "Are you sure you want to delete this message. This can't be undone"
  );
  //prettier-ignore
  const { mutate: updateMessage, isPending: isUpdatingMessages } = useUpdateMessage();
  //prettier-ignore
  const { mutate: deleteMessage, isPending: isDeletingMessage } = useDeleteMessage();
  //prettier-ignore
  const {mutate: toggleReactions, isPending :isTogglingReactions } =  useToggleReactions()
  const isPending = isUpdatingMessages;
  const handleReactions = (value: string) => {
    toggleReactions(
      { messageId: id, reaction: value },
      {
        onError: () => {
          toast.error("Failed to add reaction");
        },
      }
    );
  };
  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message deleted successfully");
          // close thread if open
          if (parentMessageId === id) {
            onCloseMessage();
          }
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      }
    );
  };
  const handleUpdate = ({ body }: { body: string }) => {
    try {
      updateMessage(
        { id, body },
        {
          onSuccess: () => {
            toast.success("Message updated successfully");
            setEditingId(null);
          },
          onError: () => {
            toast.error("Failed to update message");
          },
        }
      );
    } catch (error) {}
  };
  const avatarFallBack = authorName.charAt(0).toUpperCase();
  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isDeletingMessage &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formateFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">edited</span>
                ) : null}
                <Reactions data={reactions} onChange={handleReactions} />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  name={threadName}
                  timeStamp={threadTimestamp}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>
          {!isEditing && (
            <ToolbarReaction
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleReaction={handleReactions}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleDelete}
              hideThreadBtn={hideThreadBtn}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isDeletingMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar className="rounded-md ">
              <AvatarImage src={authorImage} />
              <AvatarFallback>{avatarFallBack}</AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  className="font-bold text-primary hover:underline"
                  onClick={() => {}}
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formateFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">edited</span>
              ) : null}
              <Reactions data={reactions} onChange={handleReactions} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                name={threadName}
                timeStamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <ToolbarReaction
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleReaction={handleReactions}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleDelete}
            hideThreadBtn={hideThreadBtn}
          />
        )}
      </div>
    </>
  );
};

export default Message;
