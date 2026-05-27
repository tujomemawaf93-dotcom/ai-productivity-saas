export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  time: string;
}
