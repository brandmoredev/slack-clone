import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  id: Id<"channels">
}

export type ChannelResponseType = Id<"channels"> | null

type Options = {
  onSuccess?: (data: ChannelResponseType) => void,
  onError?: (error: Error) => void,
  onSettled?: () => void
  throwError?: boolean
}

export const useRemoveChannel = () => {
  const [data, setData] = useState<ChannelResponseType>(null)
  const [error, setError] = useState<Error | null>(null)
  const [status, setStatus] = useState<"settled" | "pending" | "error" | "success" | null>(null)

  const isPending = useMemo(() => status === "pending", [status])
  const isSettled = useMemo(() => status === "settled", [status])
  const isError = useMemo(() => status === "error", [status])

  const mutation = useMutation(api.channels.remove);

  const mutate = useCallback(async (values: RequestType, options: Options) => {
    try {
      setData(null)
      setError(null)
      setStatus("pending")

      const response = await mutation(values);
      options.onSuccess?.(response)
      return response
    } catch (error){
      setStatus("error")
      options?.onError?.(error as Error)
      if (options?.throwError) {
        throw error
      }
    } finally {
      setStatus("settled")
      options?.onSettled?.()
    }
  }, [mutation])

  return {
    mutate,
    data,
    error,
    isPending,
    isError,
    isSettled
  }
}
