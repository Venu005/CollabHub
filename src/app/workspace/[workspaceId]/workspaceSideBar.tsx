import { useGetCurrentMember } from "@/Features/members/api/useGetCurrentMember";
import { useGetWOrkSpace } from "@/Features/workspaces/api/useGetWorkSpace";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import { AlertTriangle, Loader } from "lucide-react";
import { WorkspaceHeader } from "./workspaceHeader";

const WorkspaceSideBar = () => {
  const workspaceId = useWorkSpaceId();
  //prettier-ignore
  const { data: currWorkSpace, isLoading: workSpaceLoading } = useGetWOrkSpace({ id: workspaceId });
  //prettier-ignore
  const {data: member, isLoading:memberLoading} = useGetCurrentMember({ workspaceId });
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
    </div>
  );
};

export default WorkspaceSideBar;
