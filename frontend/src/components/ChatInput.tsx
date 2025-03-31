'use client';

import { useState, FormEvent } from 'react';
import { ChatInputProps } from '@/types/chatbot';

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState<string>('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 focus:outline-none"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`px-4 py-2 rounded-md ${
            !message.trim() || disabled
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Send
        </button>
      </div>
    </form>
  );
}