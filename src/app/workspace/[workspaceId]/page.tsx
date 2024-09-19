"use client";

import { useGetWOrkSpace } from "@/Features/workspaces/api/useGetWorkSpace";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";

import React from "react";

// interface WorkspaceIdPageProps {
//   params: {
//     workspaceId: string;
//   };
// }

const Page = () => {
  const workspaceId = useWorkSpaceId();

  const { data: workSpaceData } = useGetWOrkSpace({ id: workspaceId });

  return <div>Welcome</div>;
};

export default Page;
