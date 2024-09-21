/* eslint-disable @typescript-eslint/no-unused-vars */

import { Button } from "@/components/ui/button";
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
import { useNewJoinCode } from "@/Features/workspaces/api/usejoinCode";
import { useConfirm } from "@/hooks/useConfirmation";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
interface InviiteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviiteModalProps) => {
  const workSpaceId = useWorkSpaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will deactivate invite code and generate a new one "
  );
  const { mutate: invite, isPending: isGenerating } = useNewJoinCode();
  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workSpaceId}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };
  const handleNewCode = async () => {
    const ok = await confirm();
    if (!ok) return;
    invite(
      { workspaceId: workSpaceId },
      {
        onSuccess: () => {
          toast.success("Invite code regenerated");
        },
        onError: () => {
          toast.error("Failed to regenerate new code");
        },
      }
    );
  };
  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite your peers
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button
              className="flex gap-2"
              size={"sm"}
              variant={"ghost"}
              onClick={handleCopy}
            >
              Copy link
              <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={handleNewCode}
              variant={"outline"}
              disabled={isGenerating}
            >
              New Code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
