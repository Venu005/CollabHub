"use client";
import React from "react";
import { ToolBar } from "./toolbar";
import { Sidebar } from "./sidebar";

const WorkSpaceLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="h-full">
      <ToolBar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

export default WorkSpaceLayout;
