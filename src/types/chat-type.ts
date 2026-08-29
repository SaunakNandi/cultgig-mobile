import { Models } from "react-native-appwrite";

export type MessageType = "text" | "image" | "file" | "link";
export interface UserProfileDocument extends Models.Document {
  name?: string;
  email?: string;
  avatar_url?: string;
  role?: string;
}

export interface ConversationDocument extends Models.Document {
  last_message?: string | null;
  last_message_at?: string | null;
  unread_by?: string[] | null;
  cleared_at?: string | null;
  participants: UserProfileDocument[] | string[];
}

export interface MessageDocument extends Models.Document {
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  text?: string;
  type: MessageType;
  file_id?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  link_metadata?: string;
  deleted_for?: string[];
  is_deleted_everyone: boolean;
}
