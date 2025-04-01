export interface Message {
    id: number;
    content: string;
    isUser: boolean;
    timestamp: string;
  }
  
  export interface ChatContextType {
    messages: Message[];
    loading: boolean;
    sessionId: string | null;
    sendMessage: (message: string) => Promise<void>;
    clearMessages: () => void;
  }
  
  export interface ApiResponse {
    message: string;
    sessionId: string;
    contexts?: any[];
    searchResults?: any[];
    error?: string;
  }
  
  export interface ChatMessageProps {
    message: string;
    isUser: boolean;
  }
  
  export interface ChatWindowProps {
    messages: Message[];
    loading: boolean;
  }
  
  export interface ChatInputProps {
    onSendMessage: (message: string) => Promise<void>;
    disabled: boolean;
  }

  // types/index.ts
export interface QueryResponse {
    response: string;
    session_id: string;
    similar_contexts?: Array<{
      content: string;
      metadata: Record<string, any>;
      similarity_score: number;
    }>;
    search_results?: Array<{
      title: string;
      url: string;
      content?: string;
      score?: number;
    }>;
  }