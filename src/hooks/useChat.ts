import {
  APPWRITE_CONFIG,
  client,
  databases,
  ID,
  Query,
  storage,
} from "@/services/appwrite";
import { ConversationDocument, MessageDocument } from "@/types/chat-type";

export function useChat() {
  async function getConversation(
    userId: string,
  ): Promise<ConversationDocument[]> {
    const queries = [
      Query.equal("participants", userId),
      Query.orderDesc("last_message_at"),
      Query.limit(50),
    ];
    //@ts-ignore - Appwrite SDK 0.34.0 codegen warning
    const response = await databases.listDocuments<ConversationDocument>(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.CONVERSATIONS_COLLECTION_ID,
      queries,
    );
    return response.documents;
  }

  async function createNewConversation(
    targetUserId: string,
    currentUserId: string,
  ) {}

  async function getMessages(
    conversationId: string,
    limit = 30,
    cursor?: string,
  ): Promise<MessageDocument[]> {
    const queries = [
      Query.contains("conversation_id", conversationId),
      Query.orderDesc("last_message_at"),
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
    ];

    if (cursor) queries.push(Query.cursorAfter(cursor));
    const response = await databases.listDocuments<MessageDocument>(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.MESSAGES_COLLECTION_ID,
      queries,
    );
    return response.documents;
  }

  async function sendMessage(payload: any) {
    const now = new Date().toISOString();
    const message = await databases.createDocument<MessageDocument>(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.MESSAGES_COLLECTION_ID,
      ID.unique(),
      {
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
      },
    );
    await databases.updateDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.CONVERSATIONS_COLLECTION_ID,
      payload.conversation_id,
      {
        last_message: payload.text || `[${payload?.type?.toUpperCase()}]`,
        last_message_at: now,
        unread_by: [payload.receiverId],
      },
    );
    return message;
  }

  async function uploadFile(file: {
    uri: string;
    type: string;
    name: string;
    size: number;
  }) {
    const uploadedFile = await storage.createFile(
      APPWRITE_CONFIG.STORAGE_BUCKET_ID,
      ID.unique(),
      file,
    );
    return uploadedFile.$id;
  }

  function getFilePreviewUrl(fileId: string): string {
    return storage
      .getFilePreview(APPWRITE_CONFIG.STORAGE_BUCKET_ID, fileId)
      .toString();
  }

  function getFileDownloadUrl(fileId: string) {
    return storage
      .getFileDownload(APPWRITE_CONFIG.STORAGE_BUCKET_ID, fileId)
      .toString();
  }

  async function markAsRead(
    conversationId: string,
    userId: string,
    currentUnread: string[] = [],
  ) {
    const updatedRead = currentUnread.filter((id) => id !== userId);
    return await databases.updateDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.CONVERSATIONS_COLLECTION_ID,
      conversationId,
      {
        unread_by: updatedRead,
      },
    );
  }

  function subscribeToMessages(
    conversationId: string,
    callback: (event: any) => void,
  ) {
    const channel = `databases.${APPWRITE_CONFIG.DATABASE_ID}.collections.${APPWRITE_CONFIG.MESSAGES_COLLECTION_ID}.documents`;
    return client.subscribe(channel, (response) => {
      const payload = response.payload as MessageDocument;
      if (payload.conversation_id === conversationId) callback(response);
    });
  }
}
