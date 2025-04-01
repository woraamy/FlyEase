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