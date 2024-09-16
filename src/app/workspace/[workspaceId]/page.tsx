import React from "react";

interface WorkspaceIdPageProps {
  params: {
    workspaceId: string;
  };
}

const Page = ({ params }: WorkspaceIdPageProps) => {
  return <div>Welcome</div>;
};

export default Page;
