import { useParentMessageId } from "@/Features/messages/store/useParentMessageId";

// opening and closing threads
export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
  };
  const onCloseMessage = () => {
    setParentMessageId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    onCloseMessage,
  };
};
