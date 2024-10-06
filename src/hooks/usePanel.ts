import { useProfileMemberId } from "@/Features/members/store/useProfileMemberId";
import { useParentMessageId } from "@/Features/messages/store/useParentMessageId";
// opening and closing threads
export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();
  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
    setProfileMemberId(null);
  };
  const onOpenProfile = (memberId: string) => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  };
  //!Rename to onClose later
  const onClose = () => {
    setParentMessageId(null);
    setProfileMemberId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    onClose,
    profileMemberId,
    onOpenProfile,
  };
};
