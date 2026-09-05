import { chatUtilityFunc } from "@/services/chat.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Variable } from "lucide-react-native";

const {
  getConversation,
  isChatExistingOrNew,
  getMessages,
  sendMessage,
  getUserProfile,
} = chatUtilityFunc();

export function useGetConvesation(userId: string) {
  return useQuery({
    queryKey: ["get-conversation", userId],
    enabled: !!userId,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    queryFn: () => getConversation(userId),
  });
}

export function createChatIfNot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      targetUserId,
      myUserId,
    }: {
      targetUserId: string;
      myUserId: string;
    }) => isChatExistingOrNew(targetUserId, myUserId),
    onSuccess: (_, populatedChat) => {
      queryClient.invalidateQueries({
        queryKey: ["get-conversation"],
      });
      return populatedChat;
    },
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
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

export function useGetMyProfiileDetails(userId: string) {
  return useQuery({
    queryKey: ["get-my-profile", userId],
    enabled: !!userId,
    queryFn: () => getUserProfile(userId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
