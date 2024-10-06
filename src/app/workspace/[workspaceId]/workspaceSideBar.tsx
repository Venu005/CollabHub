/* eslint-disable @typescript-eslint/no-unused-vars */
import { useGetCurrentMember } from "@/Features/members/api/useGetCurrentMember";
import { useGetWOrkSpace } from "@/Features/workspaces/api/useGetWorkSpace";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import { WorkspaceHeader } from "./workspaceHeader";
import { SideBarItem } from "./SideBarItem";
import { useGetChannels } from "@/Features/channels/api/useGetChannels";
import { WorkSpaceSection } from "./workSpaceSection";
import { useGetMembers } from "@/Features/members/api/useGetMembers";
import { UserItem } from "./UserItem";
import { useCreateChannelModal } from "@/Features/channels/store/useCreateChannelModal";
import { useChannelId } from "@/hooks/useChannelId";
import { useMemberId } from "@/hooks/useMemberId";

const WorkspaceSideBar = () => {
  const workspaceId = useWorkSpaceId();
  const channelId = useChannelId();
  const memberId = useMemberId();
  const [_open, setOpen] = useCreateChannelModal();

  //prettier-ignore
  const { data: currWorkSpace, isLoading: workSpaceLoading } = useGetWOrkSpace({ id: workspaceId });
  //prettier-ignore
  const {data: member, isLoading:memberLoading} = useGetCurrentMember({ workspaceId });
  //prettier-ignore
  const {data: channels,isLoading:channelsLoading} =  useGetChannels({id: workspaceId})
  //prettier-ignore
  const {data:members, isLoading:memberIsLoading}  =  useGetMembers({workspaceId})
  if (workSpaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <Loader className="size-5 animate-spin" />
      </div>
    );
  }

  if (!currWorkSpace || !member) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center gap-y-2">
        <AlertTriangle className="size-5  text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader
        workspace={currWorkSpace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SideBarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SideBarItem label="Drafts & Sent" icon={SendHorizonal} id="drafts" />
      </div>
      <WorkSpaceSection
        label="Channels"
        hint="New Channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <SideBarItem
            key={item._id}
            label={item.name}
            icon={HashIcon}
            id={item._id}
            variant={channelId === item._id ? "active" : "default"}
          />
        ))}
      </WorkSpaceSection>
      <WorkSpaceSection
        label="Direct Messages"
        hint="New direct message"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <UserItem
            id={item._id}
            label={item.user.name}
            image={item.user.image}
            key={item._id}
            variant={item._id === memberId ? "active" : "default"}
          />
        ))}
      </WorkSpaceSection>
    </div>
  );
};

export default WorkspaceSideBar;
