"use client";
import React from "react";
import { ToolBar } from "./toolbar";
import { Sidebar } from "./sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkspaceSideBar from "./workspaceSideBar";
import { usePanel } from "@/hooks/usePanel";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Thread } from "@/Features/messages/components/Thread";

const WorkSpaceLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { parentMessageId, onCloseMessage } = usePanel();
  const showPanel = !!parentMessageId;
  return (
    <div className="h-full">
      <ToolBar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="vs-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
            <WorkspaceSideBar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} className="" defaultSize={30}>
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={30}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onCloseMessage}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkSpaceLayout;
