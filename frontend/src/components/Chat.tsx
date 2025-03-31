// components/Chat.tsx
import { useState, useEffect } from 'react';
import { sendMessage, checkApiHealth } from '@/app/action';

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    // Check if API is available on component mount
    checkApiHealth().then(setApiAvailable);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const result = await sendMessage(input, messages);
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: result.response,
          context: result.context,
          searchResults: result.search_results
        }
      ]);
    } catch (error) {
      console.error('Failed to get response:', error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error processing your request.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!apiAvailable) {
    return <div className="error-message">
      API is not available. Please make sure the backend server is running.
    </div>;
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && <div className="loading">Thinking...</div>}
      </div>
      
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
}