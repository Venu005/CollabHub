"use client"; // techinacally opens a boundary between client and server

import { CreateChannelModal } from "@/Features/channels/components/createChannelModal";
import { CreateWorkSpaceModal } from "@/Features/workspaces/components/createWorkSpaceModal";
import { useEffect, useState } from "react";

export const Modals = () => {
  // preventing hydration errors
  const [mounted, setMounted] = useState(false);
  // use effect is only called on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <>
      <CreateChannelModal />
      <CreateWorkSpaceModal />
    </>
  );
};
