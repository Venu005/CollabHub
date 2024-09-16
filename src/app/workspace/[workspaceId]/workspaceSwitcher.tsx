import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetWOrkSpace } from "@/Features/workspaces/api/useGetWorkSpace";
import { useGetWOrkSpaces } from "@/Features/workspaces/api/useGetWorkSpaces";
import { useCreateWorkSpaceModal } from "@/Features/workspaces/store/useCreateWorkSpaceModal";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkSpaceId();
  // ada kuda work space create seyadaniki we cn eep a plus symbol
  const [_open, setOpen] = useCreateWorkSpaceModal();
  //prettier-ignore
  const { data: workSpace, isLoading: isWorkSpaceLoading }  = useGetWOrkSpace({ id: workspaceId });
  const { data: workSpaces, isLoading } = useGetWOrkSpaces();

  const filteredWorkSpaces = workSpaces?.filter(
    (workSpace) => workSpace._id !== workspaceId
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className=" size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
          {isWorkSpaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            workSpace?.name[0].toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          className="cursor-pointer flex-col justify-start items-start capitalize"
          onClick={() => router.push(`/workspace/${workspaceId}`)}
        >
          {workSpace?.name}
          <span className="text-xs text-muted-foreground">
            Active WorkSpace
          </span>
        </DropdownMenuItem>
        {filteredWorkSpaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className="cursor-pointer capitalize overflow-hidden"
            onClick={() => router.push(`/workspace/${workspace._id}`)}
          >
            <div className=" shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mt-2 mr-2">
              {workspace.name[0].toUpperCase()}
            </div>
            <p className="truncate"> {workspace.name}</p>
          </DropdownMenuItem>
        ))}
        {/* creting new */}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mt-2">
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
