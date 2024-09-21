/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { useGetWorkspaceInfo } from "@/Features/workspaces/api/useGetWorkspaceInfo";
import { useJoinMember } from "@/Features/workspaces/api/useJoinMember";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";
const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkSpaceId();
  const { mutate: joinMember, isPending: joiningMember } = useJoinMember();
  //prettier-ignore
  const { data: workspaceData, isLoading } = useGetWorkspaceInfo({id:workspaceId});

  const isMember = useMemo(
    () => workspaceData?.isMember,
    [workspaceData?.isMember]
  );
  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, workspaceId, router]);

  const handleComplete = (value: string) => {
    joinMember(
      { joinCode: value, workspaceId },
      {
        onSuccess: (id) => {
          toast.success("Workspace joined successfully");
          router.replace(`/workspace/${id}`);
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      }
    );
  };
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src={"/logo.svg"} width={60} height={60} alt="logo" />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {workspaceData?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          onComplete={handleComplete}
          classNames={{
            container: cn(
              "flex gap-x-2",
              joiningMember && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
        />
      </div>
      <div className="flex gap-x-4">
        <Button size={"lg"} variant={"outline"} asChild>
          <Link href={"/"}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
