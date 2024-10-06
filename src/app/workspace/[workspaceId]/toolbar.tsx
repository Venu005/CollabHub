import { Button } from "@/components/ui/button";
import { useGetWOrkSpace } from "@/Features/workspaces/api/useGetWorkSpace";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import { Info, Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useState } from "react";
import { useGetChannels } from "@/Features/channels/api/useGetChannels";
import { useGetMembers } from "@/Features/members/api/useGetMembers";

import { useRouter } from "next/navigation";

export const ToolBar = () => {
  const workSPaceId = useWorkSpaceId();
  const router = useRouter();
  const { data: workSpaceData } = useGetWOrkSpace({ id: workSPaceId });
  const { data: channels } = useGetChannels({ id: workSPaceId });
  const { data: members } = useGetMembers({ workspaceId: workSPaceId });
  const [open, setOpen] = useState(false);

  const onChannelClick = (channelId: string) => {
    setOpen(false);
    router.push(`/workspace/${workSPaceId}/channel/${channelId}`);
  };
  const onMemberClick = (memberId: string) => {
    setOpen(false);
    router.push(`/workspace/${workSPaceId}/member/${memberId}`);
  };
  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          onClick={() => setOpen(true)}
          className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 p-2 "
          size={"sm"}
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">
            Search Workspace {workSpaceData?.name}
          </span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => onChannelClick(channel._id)}
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={() => onMemberClick(member._id)}
                >
                  {member.user?.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant={"transparent"} size={"iconSm"}>
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
