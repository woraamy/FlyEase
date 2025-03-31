'use client';

import { useRef, useEffect } from 'react';
import ChatMessage from '@/components/ChatMessage';
import LoadingDots from '@/components/LoadingDots';
import { ChatWindowProps } from '@/types/chatbot';

export default function ChatWindow({ messages, loading }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-lg bg-white shadow-sm">
      {messages.map((message) => (
        <ChatMessage 
          key={message.id} 
          message={message.content} 
          isUser={message.isUser} 
        />
      ))}
      
      {loading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
            <LoadingDots />
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}