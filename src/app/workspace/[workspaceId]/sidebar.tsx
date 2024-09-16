"use client";
import { UserButton } from "@/Features/auth/components/UserButton";
import React from "react";
import { WorkspaceSwitcher } from "./workspaceSwitcher";
import { Sidebarbutton } from "./sidebarbutton";
import { Bell, Home, MessageSquare, MoreHorizontal } from "lucide-react";
export const Sidebar = () => {
  return (
    <aside className="w-[70px] h-full bg-[#481349] items-center pt-[9px] pb-[4px] flex flex-col gap-y-4">
      <WorkspaceSwitcher />
      <Sidebarbutton icon={Home} label="Home" isActive />
      <Sidebarbutton icon={MessageSquare} label="DMs" />
      <Sidebarbutton icon={Bell} label="Activity" />
      <Sidebarbutton icon={MoreHorizontal} label="More" />

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};
