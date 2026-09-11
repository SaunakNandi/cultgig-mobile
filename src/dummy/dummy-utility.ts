import {
  ConversationDocument,
  MessageDocument,
  SendMessagePayload,
  UserProfileDocument,
} from "@/types/chat-type";

// 🧪 In-Memory Mock Store for Local Testing
const MOCK_PARTICIPANT: UserProfileDocument = {
  $id: "partner-user-id",
  name: "Gemini",
  avatar_url:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
  email: "partner@example.com",
  role: "business_owner",
  //   mobile_no: null,
  $sequence: "1",
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
  $permissions: [],
  $databaseId: "mock-db",
  $collectionId: "user",
};

let MOCK_CONVERSATIONS: ConversationDocument[] = [
  {
    $id: "conv-1",
    participant_ids: ["6a8f327800175a53acc0", "partner-user-id"],
    participants: [MOCK_PARTICIPANT],
    last_message: "Hey! Let's check out the new chat layout 🚀",
    last_message_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unread_by: ["6a8f327800175a53acc0"],
    cleared_at: null,
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    $databaseId: "mock-db",
    $collectionId: "conversations",
    $sequence: "1",
  },
];

let MOCK_MESSAGES: MessageDocument[] = [
  {
    $id: "msg-1",
    conversation_id: "conv-1",
    sender_id: "partner-user-id",
    receiver_id: "6a8f327800175a53acc0",
    text: "Hey! Let's check out the new chat layout 🚀",
    type: "text",
    file_id: null,
    file_name: null,
    file_size: null,
    mime_type: null,
    link_metadata: null,
    deleted_for: [],
    is_deleted_everyone: false,
    $createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    $databaseId: "mock-db",
    $collectionId: "messages",
    $sequence: "1",
  },
  {
    $id: "msg-2",
    conversation_id: "conv-1",
    sender_id: "6a8f327800175a53acc0",
    receiver_id: "partner-user-id",
    text: "Looks clean! Testing file attachments next.",
    type: "text",
    file_id: null,
    file_name: null,
    file_size: null,
    mime_type: null,
    link_metadata: null,
    deleted_for: [],
    is_deleted_everyone: false,
    $createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    $databaseId: "mock-db",
    $collectionId: "messages",
    $sequence: "2",
  },
];

export function DummyUtility() {
  async function getConversation(
    _userId: string,
  ): Promise<ConversationDocument[]> {
    return [...MOCK_CONVERSATIONS];
  }

  async function isChatExistingOrNew(targetUser: string, currentUser: string) {
    const found = MOCK_CONVERSATIONS.find((c) =>
      c.participant_ids.includes(targetUser),
    );
    if (found) return found;

    const newChat: ConversationDocument = {
      $id: `conv-${Date.now()}`,
      participant_ids: [currentUser, targetUser],
      participants: [MOCK_PARTICIPANT],
      last_message: null,
      last_message_at: new Date().toISOString(),
      unread_by: [],
      cleared_at: null,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $databaseId: "mock-db",
      $collectionId: "conversations",
      $sequence: `${MOCK_CONVERSATIONS.length + 1}`,
    };
    MOCK_CONVERSATIONS.unshift(newChat);
    return newChat;
  }

  function getChatPartner(
    conversation: ConversationDocument,
    currentUserId: string,
  ): UserProfileDocument | undefined {
    if (!Array.isArray(conversation.participants)) return;
    return conversation.participants.find(
      (item): item is UserProfileDocument =>
        typeof item !== "string" && item.$id !== currentUserId,
    );
  }

  async function getMessages(
    conversationId: string,
    _limit = 30,
    _cursor?: string,
  ): Promise<MessageDocument[]> {
    return MOCK_MESSAGES.filter(
      (m) => m.conversation_id === conversationId,
    ).sort(
      (a, b) =>
        new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime(),
    );
  }

  async function sendMessage(payload: SendMessagePayload) {
    const now = new Date().toISOString();
    const newMsg: MessageDocument = {
      $id: `msg-${Date.now()}`,
      conversation_id: payload.conversationId,
      sender_id: payload.senderId,
      receiver_id: payload.receiverId,
      text: payload.text ?? "",
      type: payload.type ?? "text",
      file_id: payload.fileId ?? null,
      file_name: payload.fileName ?? null,
      file_size: payload.fileSize ?? null,
      mime_type: payload.mimeType ?? null,
      link_metadata: payload.linkMetadata ?? null,
      deleted_for: [],
      is_deleted_everyone: false,
      $createdAt: now,
      $updatedAt: now,
      $permissions: [],
      $databaseId: "mock-db",
      $collectionId: "messages",
      $sequence: `${MOCK_MESSAGES.length + 1}`,
    };

    MOCK_MESSAGES.push(newMsg);

    // Update conversation snippet in-memory
    MOCK_CONVERSATIONS = MOCK_CONVERSATIONS.map((c) =>
      c.$id === payload.conversationId
        ? {
            ...c,
            last_message: payload.text || `[${payload?.type?.toUpperCase()}]`,
            last_message_at: now,
            unread_by: [payload.receiverId],
          }
        : c,
    );

    return newMsg;
  }

  async function uploadFile(file: {
    uri: string;
    type: string;
    name: string;
    size: number;
  }) {
    // 🌟 Emulate upload latency, then return the local uri directly
    await new Promise((resolve) => setTimeout(resolve, 300));
    return file.uri;
  }

  function getFilePreviewUrl(fileId: string): string {
    // 🌟 If fileId is a local uri (from upload), return it directly; else fallback to sample
    if (fileId.startsWith("file://") || fileId.startsWith("http")) {
      return fileId;
    }
    return "https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=600";
  }

  function getFileDownloadUrl(fileId: string): string {
    return fileId;
  }

  async function markAsRead(
    conversationId: string,
    userId: string,
    currentUnread: string[] = [],
  ) {
    const updatedRead = currentUnread.filter((id) => id !== userId);
    MOCK_CONVERSATIONS = MOCK_CONVERSATIONS.map((c) =>
      c.$id === conversationId ? { ...c, unread_by: updatedRead } : c,
    );
  }

  function subscribeToMessages(
    _conversationId: string,
    _callback: (event: any) => void,
  ) {
    // Return dummy unsubscribe handler for cleanup
    return () => {};
  }

  async function getUserProfile(userId: string) {
    return { ...MOCK_PARTICIPANT, $id: userId };
  }

  return {
    markAsRead,
    subscribeToMessages,
    getChatPartner,
    getConversation,
    getFileDownloadUrl,
    getFilePreviewUrl,
    getMessages,
    uploadFile,
    sendMessage,
    isChatExistingOrNew,
    getUserProfile,
  };
}
