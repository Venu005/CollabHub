/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateChannel } from "@/Features/channels/api/useUpdateChannel";
import { useDeleteChannel } from "@/Features/channels/api/useDeleteChannel";
import { useChannelId } from "@/hooks/useChannelId";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirmation";
import { useRouter } from "next/navigation";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import { useGetCurrentMember } from "@/Features/members/api/useGetCurrentMember";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const Header = ({
  memberName = "Member",
  memberImage,
  onClick,
}: HeaderProps) => {
  const avatarFallBack = memberName[0].toUpperCase();
  return (
    <>
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Button
          variant={"ghost"}
          className="text-lg font-semibold px-2 overflow-hidden w-auto"
          size={"sm"}
          onClick={onClick}
        >
          <Avatar className="size-6 mr-2">
            <AvatarImage src={memberImage} />
            <AvatarFallback>{avatarFallBack}</AvatarFallback>
          </Avatar>
          <span className="truncate">{memberName}</span>
          <FaChevronDown className="size-2.5 ml-2" />
        </Button>
      </div>
    </>
  );
};
