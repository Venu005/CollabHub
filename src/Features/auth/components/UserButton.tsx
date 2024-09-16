"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

export const UserButton = () => {
  const { signOut } = useAuthActions();
  const { data: currUserData, isLoading: isFetchingCurrUserData } =
    useCurrentUser();
  if (isFetchingCurrUserData) {
    return <Loader className="animate-spin size-4 text-muted-foreground" />;
  }
  if (!currUserData) {
    return null;
  }

  // destrucuting to get image
  const { name, image } = currUserData;
  const avatarFallBack = name!.charAt(0).toUpperCase();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="transition size-10 hover:opacity-75">
          <AvatarImage src={image} />
          <AvatarFallback className="bg-sky-500 text-white">{avatarFallBack}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={() => signOut()} className="h-10">
          <LogOut className="size-4 mr-2" />
          <text>Logout</text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
