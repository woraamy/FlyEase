// 'use client';

// import { useEffect } from 'react';
// import { useChat } from '@/hooks/useChat';
// import ChatWindow from '@/components/ChatWindow';
// import ChatInput from '@/components/ChatInput';

// export default function ChatPage() {
//   const { messages, sendMessage, loading } = useChat();
  
//   // Add a welcome message when the chat first loads
//   useEffect(() => {
//     if (messages.length === 0) {
//       sendMessage("Hi! I'm your flight assistant. How can I help you today?");
//     }
//   }, []);
  
//   return (
//     <main className="flex min-h-screen flex-col bg-gray-50">
//       <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4">
//         <header className="py-4 border-b border-gray-200">
//           <h1 className="text-2xl font-semibold text-center text-blue-700">
//             AI Flight Assistant
//           </h1>
//         </header>
        
//         <div className="flex-1 flex flex-col mt-4 h-[calc(100vh-200px)]">
//           <ChatWindow messages={messages} loading={loading} />
//           <ChatInput onSendMessage={sendMessage} disabled={loading} />
//         </div>
//       </div>
//     </main>
//   );
// }


// app/page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { sendMessage, checkApiHealth } from '@/app/action';

// export default function ChatPage() {
//   const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiAvailable, setApiAvailable] = useState(true);
//   const [sessionId, setSessionId] = useState<string | undefined>(undefined);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     checkApiHealth().then(setApiAvailable);
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!input.trim() || isLoading) return;
    
//     const userMessage = { role: 'user', content: input };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);
    
//     try {
//       const result = await sendMessage(input, messages, sessionId);
      
//       // Store session ID for future requests
//       if (result.session_id) {
//         setSessionId(result.session_id);
//       }
      
//       setMessages(prev => [
//         ...prev, 
//         { role: 'assistant', content: result.response }
//       ]);
//     } catch (error) {
//       console.error('Failed to get response:', error);
//       setMessages(prev => [
//         ...prev, 
//         { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   if (!apiAvailable) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-100">
//         <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
//           <h2 className="text-xl font-bold text-red-600 mb-2">Connection Error</h2>
//           <p className="text-gray-700 mb-4">Cannot connect to the chatbot API. Please make sure the backend server is running.</p>
//           <button 
//             onClick={() => checkApiHealth().then(setApiAvailable)}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//           >
//             Retry Connection
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-50">
//       <div className="bg-blue-600 p-4 text-white text-center">
//         <h1 className="text-xl font-bold">AI Assistant</h1>
//       </div>
      
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.length === 0 ? (
//           <div className="text-center text-gray-500 my-20">
//             <p>How can I help you today?</p>
//           </div>
//         ) : (
//           messages.map((msg, i) => (
//             <div 
//               key={i} 
//               className={`max-w-[80%] p-3 rounded-2xl ${
//                 msg.role === 'user' 
//                   ? 'ml-auto bg-blue-500 text-white rounded-br-sm' 
//                   : 'mr-auto bg-white text-gray-800 shadow-sm rounded-bl-sm'
//               } animate-fade-in`}
//             >
//               <div className="whitespace-pre-wrap break-words">
//                 {msg.content}
//               </div>
//             </div>
//           ))
//         )}
//         {isLoading && (
//           <div className="max-w-[80%] p-3 rounded-2xl mr-auto bg-white text-gray-800 shadow-sm rounded-bl-sm">
//             <div className="flex space-x-1 justify-center items-center p-2">
//               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
      
//       <form onSubmit={handleSubmit} className="flex p-4 bg-white border-t border-gray-200">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message..."
//           disabled={isLoading}
//           className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//         <button 
//           type="submit" 
//           disabled={isLoading || !input.trim()}
//           className="ml-2 px-6 py-2 bg-blue-500 text-white rounded-full font-medium disabled:bg-gray-400 hover:bg-blue-600 transition-colors"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }


// app/page.tsx
// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { QueryResponse } from '@/types/chatbot';
import ChatHistory from '@/components/ChatHistory';
import QueryForm from '@/components/QueryForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ModeToggle } from '@/components/ui/mode-toggle';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{query: string, response: string}>>([]);

  useEffect(() => {
    // Load session ID from localStorage if available
    const savedSessionId = localStorage.getItem('sessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          session_id: sessionId || undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: QueryResponse = await response.json();
      
      // Save the new session ID
      if (data.session_id) {
        setSessionId(data.session_id);
        localStorage.setItem('sessionId', data.session_id);
      }

      // Add to history
      setHistory([
        ...history,
        { query, response: data.response }
      ]);

      // Clear input
      setQuery('');
    } catch (error) {
      console.error('Error:', error);
      setHistory([
        ...history,
        { query, response: 'Error: Could not process your request' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-3xl">
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold">Travel Assistant</CardTitle>
            {/* <ModeToggle /> */}
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <ChatHistory history={history} />
            
            <QueryForm 
              query={query}
              setQuery={setQuery}
              handleSubmit={handleSubmit}
              loading={loading}
            />
            
            {sessionId && (
              <div className="mt-2 text-xs text-muted-foreground text-center">
                Session ID: {sessionId}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}