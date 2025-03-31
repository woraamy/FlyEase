// components/QueryForm.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface QueryFormProps {
  query: string;
  setQuery: (query: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

export default function QueryForm({ query, setQuery, handleSubmit, loading }: QueryFormProps) {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about travel destinations..."
        disabled={loading}
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={loading || !query.trim()}
        className="min-w-[100px]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Thinking
          </>
        ) : (
          'Send'
        )}
      </Button>
    </form>
  );
}