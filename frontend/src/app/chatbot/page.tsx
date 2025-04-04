'use client';

import { useState, useEffect } from 'react';
import { PacmanLoader } from "react-spinners";
import { fetchQuery } from '@/app/actions';
import { QueryResponse } from '@/types/chatbot';
import ChatHistory from '@/components/ChatHistory';
import QueryForm from '@/components/QueryForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{ query: string, response: string }>>([]);

  useEffect(() => {
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
      const data: QueryResponse = await fetchQuery(query, sessionId);
      
      if (data.session_id) {
        setSessionId(data.session_id);
        localStorage.setItem('sessionId', data.session_id);
      }

      setHistory([...history, { query, response: data.response }]);
      setQuery('');
    } catch (error) {
      console.error('Error:', error);
      setHistory([...history, { query, response: 'Error: Could not process your request' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-3xl">
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold text-green-600">Travel Assistant</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <ChatHistory history={history} />
            
            {loading && (
              <div className="flex justify-center my-4">
                <PacmanLoader color="#0B6623" size={25} />
              </div>
            )}
            
            <QueryForm query={query} setQuery={setQuery} handleSubmit={handleSubmit} loading={loading} />
            
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