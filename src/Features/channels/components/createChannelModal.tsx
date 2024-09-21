/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateChannelModal } from "../store/useCreateChannelModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateChannel } from "../api/useCreateChannel";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateChannelModal = () => {
  const workspaceId = useWorkSpaceId();
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();
  const [name, setName] = useState("");
  //prettier-ignore
  const {mutate : createChannel, isPending: isCreatingChannel} =  useCreateChannel()
  // channel names should not have spaces if spaces convert to -
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createChannel(
      {
        name,
        workspaceId,
      },
      {
        onSuccess: (id) => {
          toast.success("Channel created successfully");
          router.push(`/workspace/${workspaceId}/channel/${id}`);
          handleClose();
        },

        onError: () => {
          toast.error("Failed to create channel");
        },
      }
    );
  };

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            disabled={isCreatingChannel}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g team-trip-budget"
          />
          <div className="flex justify-end">
            <Button disabled={isCreatingChannel}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
