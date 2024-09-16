"use client";
import React from "react";
import { ToolBar } from "./toolbar";

const WorkSpaceLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="h-full">
      <ToolBar />
      {children}
    </div>
  );
};

export default WorkSpaceLayout;
