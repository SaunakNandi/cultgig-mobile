import { chatUtilityFunc } from "@/services/chat.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Variable } from "lucide-react-native";

const { getConversation, isChatExistingOrNew, getMessages, sendMessage } =
  chatUtilityFunc();

export function useGetConvesation(userId: string) {
  return useQuery({
    queryKey: ["get-conversation", userId],
    enabled: !!userId,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    queryFn: () => getConversation(userId),
  });
}

export function createChatIfNot(targetUserId: string, myUserId: string) {
  return useQuery({
    queryKey: ["messages", targetUserId, myUserId],
    queryFn: () => isChatExistingOrNew(targetUserId, myUserId),
    enabled: !!targetUserId && !!myUserId,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
    refetchOnWindowFocus: true,
  });
}

export function useSendMessages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => sendMessage(payload),
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variable.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-conversation"],
      });
    },
  });
}
