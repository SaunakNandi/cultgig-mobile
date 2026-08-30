import { Text } from "@/components/ui/text";
import { chatUtilityFunc } from "@/services/chat.service";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { getConversation, isChatExistingOrNew } = chatUtilityFunc();
  const callFunc = async () => {
    const createChatIfPossible = await isChatExistingOrNew(
      "6a8f327800175a53acc0",
      "6a8f32b9003c7e1dfc03",
    );
    console.log("createChatIfPossible ", createChatIfPossible);
    const getMyChatCollection = await getConversation("6a8f327800175a53acc0");
    console.log("getMyChatCollection => ", getMyChatCollection);
  };
  useEffect(() => {
    callFunc();
  }, []);
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="flex-1 items-center justify-center bg-white"
    >
      <Text className="text-xl font-bold text-gray-900">Chat</Text>
    </SafeAreaView>
  );
}
