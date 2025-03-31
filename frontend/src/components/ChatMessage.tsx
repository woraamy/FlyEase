import Image from 'next/image';
import { ChatMessageProps } from '@/types/chatbot';

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <div className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
          <Image 
            src="/images/bot-avatar.png" 
            alt="Bot" 
            width={32} 
            height={32} 
          />
        </div>
      )}
      
      <div className={`p-3 rounded-lg max-w-[80%] ${
        isUser 
          ? 'bg-blue-600 text-white rounded-br-none' 
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
      }`}>
        <p className="text-sm">{message}</p>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
          <Image 
            src="/images/user-avatar.png" 
            alt="User" 
            width={32} 
            height={32} 
          />
        </div>
      )}
    </div>
  );
}