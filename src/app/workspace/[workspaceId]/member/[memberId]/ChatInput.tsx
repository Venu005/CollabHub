/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCreateMessage } from "@/Features/messages/api/useCreateMessage";
import { useGenUploadUrl } from "@/Features/upload/api/useGenUploadUrl";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import dynamic from "next/dynamic";
import Quill from "quill";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

interface ChatInputProps {
  placeholder: string;
  conversationId: Id<"conversations">;
}

type CreateMessageValues = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
};

export const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);
  const workspaceId = useWorkSpaceId();

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenUploadUrl();
  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);
      const values: CreateMessageValues = {
        conversationId,
        workspaceId,
        body,
        image: undefined,
      };
      // if user uploads any image
      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) {
          throw new Error("Failed to generate upload url");
        }
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });
        if (!result.ok) {
          throw new Error("Failed to upload image");
        }
        const { storageId } = await result.json();
        values.image = storageId;
      }

      await createMessage(values, {
        throwError: true,
      });
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message ");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };
  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};
