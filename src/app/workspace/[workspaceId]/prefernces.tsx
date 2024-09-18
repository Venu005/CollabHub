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
import { Input } from "@/components/ui/input";
import { useDeleteWorkSpace } from "@/Features/workspaces/api/useDeleteWorkSpace";
import { useUpdateWorkSpace } from "@/Features/workspaces/api/useUpdateWorkSpace";
import { useConfirm } from "@/hooks/useConfirmation";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PreferncesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferncesModalProps) => {
  const router = useRouter();
  const workSpaceId = useWorkSpaceId();
  const [oldName, setNewName] = useState(initialValue);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action is irreversible"
  );
  //prettier-ignore
  const {mutate :updateWorkSpace, isPending:isUpdatingWorkSpace} =  useUpdateWorkSpace();
  //prettier-ignore
  const {mutate:deleteWorkSpace, isPending: isDeletingWorkSpace} =  useDeleteWorkSpace();
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkSpace(
      {
        id: workSpaceId,
        name: oldName,
      },
      {
        onSuccess: () => {
          setUpdate(false);
          toast.success("Workspace updated successfully");
        },
        onError: () => {
          toast.error("Failed to update workspace");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;
    deleteWorkSpace(
      {
        id: workSpaceId,
      },
      {
        onSuccess: () => {
          setOpen(false);
          router.replace("/");
          toast.success("Workspace deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete workspace");
        },
      }
    );
  };

  // opening and closing modal
  const [update, setUpdate] = useState(false);
  return (
    <>
      <ConfirmDialog />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{oldName}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={update} onOpenChange={setUpdate}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 ">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Worskspace name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{oldName}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEdit} className="space-y-4">
                  <Input
                    value={oldName}
                    disabled={isUpdatingWorkSpace}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Give your workspace a new name"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant={"outline"}
                        disabled={isUpdatingWorkSpace}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkSpace}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={isDeletingWorkSpace}
              onClick={handleRemove}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">Delete Workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreferencesModal;
