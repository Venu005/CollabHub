"use client";

import { useGetChannelById } from "@/Features/channels/api/useGetChannelById";
import { useChannelId } from "@/hooks/useChannelId";
import { Loader, TriangleAlert } from "lucide-react";
import { Header } from "./Header";
import { ChatInput } from "./ChatInput";
import { useGetMessage } from "@/Features/messages/api/useGetMessage";

const ChannelPage = () => {
  const channelId = useChannelId();
  const {results} =  useGetMessage({channelId})
  const { data: channel, isLoading: isLoadingChannel } = useGetChannelById({
    id: channelId,
  });
  if (isLoadingChannel) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      <Header channelName={channel.name} />
      <div className="flex-1" />
      <ChatInput placeholder={`Message # ${channel.name} `} />
    </div>
  );
};

export default ChannelPage;
