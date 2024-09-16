"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkSpaceModal } from "../store/useCreateWorkSpaceModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkSpace } from "../api/useCreateWorkSpace";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkSpaceModal = () => {
  //* these are contolled by the open, setOpen in main page.tsx as it is global state
  const [open, setOpen] = useCreateWorkSpaceModal();
  const [name, setName] = useState("");
  const { mutate: createWorkSpace } = useCreateWorkSpace();
  const router = useRouter();
  const handleClose = () => {
    // celear form after creting wrkspace
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createWorkSpace(
      { name },
      {
        onSuccess(id) {
          // console.log(id);
          toast.success("Workspce created successfully");
          router.push(`/workspace/${id}`);
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            disabled={false}
            value={name}
            required
            autoFocus
            minLength={3}
            onChange={(e) => setName(e.target.value)}
            placeholder="Workspace name e.g 'Work', 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button disabled={false}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
