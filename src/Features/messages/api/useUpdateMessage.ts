import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

//  building our own usemutation hehe
type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

// body: v.string(),
// image: v.optional(v.id("_storage")),
// workspaceId: v.id("workspaces"),
// channelId: v.optional(v.id("channels")), // direct meesages kuda untay
// parentMessageId: v.optional(v.id("messages")), // replies
// updatedAt: v.number(),
type RequestType = {
  id: Id<"messages">;
  body: string;
};
type ResponseType = Id<"messages"> | null;

export const useUpdateMessage = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  // prettier-ignore
  const [status,setStatus] =  useState <'success' | 'error'| 'settled'| 'pending'| null >(null)

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  //   const [isPending, setIsPending] = useState<boolean>(false);
  //   const [isSuccess, setIsSuccess] = useState<boolean>(false);
  //   const [isError, setIsError] = useState<boolean>(false);
  //   const [isSettled, setIsSettled] = useState<boolean>(false);

  const mutation = useMutation(api.messages.update);
  // call back to store it for later user
  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");
        const response = await mutation(values); // going to return ids
        options?.onSuccess?.(response);
        //setData(response);
        return response;
      } catch (error) {
        // setError(error as Error);
        setStatus("error");
        options?.onError?.(error as Error);
        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, data, error, isError, isPending, isSettled, isSuccess };
};
