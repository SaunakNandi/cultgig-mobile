import { Text } from "@/components/ui/text";
import { MessageDocument, UserProfileDocument } from "@/types/chat-type";
import { Image, View } from "react-native";

interface RenderMessageInterface {
  item: MessageDocument;
  userId: string;
  participant: UserProfileDocument | null;
}
export const RenderMessage = ({
  item,
  userId,
  participant,
}: RenderMessageInterface) => {
  const isitMe = item.sender_id === userId;
  const isPending = item?.$id.startsWith("temp");
  return (
    <View
      className={`flex-row w-full mb-4 px-4 items-end ${
        isitMe ? "justify-end" : "justify-start"
      }`}
    >
      {/* Partner Avatar (Left) */}
      {!isitMe && (
        <View className="w-8 h-8 rounded-full bg-neutral-200 mr-2 overflow-hidden items-center justify-center">
          {participant && participant?.avatar_url ? (
            <Image
              source={{ uri: participant.avatar_url }}
              className="w-full h-full"
            />
          ) : (
            <Text className="text-xs font-bold text-neutral-600">
              {participant?.name?.charAt(0)}
            </Text>
          )}
        </View>
      )}

      {/* Chat Bubble */}
      <View
        className={`max-w-[75%] px-4 py-3 ${
          isitMe
            ? "bg-[#6B2D5C] rounded-2xl rounded-br-sm" // My message bubble
            : "bg-neutral-100 rounded-2xl rounded-bl-sm" // Partner message bubble
        } ${isPending ? "opacity-70" : "opacity-100"}`}
      >
        <Text
          className={`text-base ${isitMe ? "text-white" : "text-neutral-800"}`}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );
};
