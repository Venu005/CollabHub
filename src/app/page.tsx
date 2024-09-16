"use client";
import { UserButton } from "@/Features/auth/components/UserButton";
import { useGetWOrkSpaces } from "@/Features/workspaces/api/useGetWorkSpaces";
import { useCreateWorkSpaceModal } from "@/Features/workspaces/store/useCreateWorkSpaceModal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Home() {
  const [open, setOpen] = useCreateWorkSpaceModal(); // hjust like useState is now a global state
  // prettier-ignore
  const { data: workSpaces, isLoading: isLoadingWorkSpaces } = useGetWOrkSpaces();
  const workSpaceId = useMemo(() => workSpaces?.[0]?._id, [workSpaces]);
  const router =  useRouter()
  useEffect(() => {
    if (isLoadingWorkSpaces) return;
    if (workSpaceId) {
       router.replace(`/workspace/${workSpaceId}`)
      console.log("reirecting to other workspace");

    } else if (!open) {
      setOpen(true);
      console.log("open creation modal"); // when no workspace exists
    }
  }, [workSpaceId, isLoadingWorkSpaces, open, setOpen, router]);
  return (
    <div>
      Yaay!! Logged in
      <UserButton />
    </div>
  );
}
