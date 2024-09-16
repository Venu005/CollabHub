import { Button } from "@/components/ui/button";
import { useGetWOrkSpace } from "@/Features/workspaces/api/useGetWorkSpace";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import { Info, Search } from "lucide-react";

export const ToolBar = () => {
  const workSPaceId = useWorkSpaceId();
  const { data: workSpaceData } = useGetWOrkSpace({ id: workSPaceId });
  return (
    <nav className="bg-[#4B1349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 p-2 "
          size={"sm"}
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">
            Search Workspace {workSpaceData?.name}
          </span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant={"transparent"} size={"iconSm"}>
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
