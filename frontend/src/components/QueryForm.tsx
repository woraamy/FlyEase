import React from 'react';
import { ClockLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface QueryFormProps {
  query: string;
  setQuery: (query: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function QueryForm({ query, setQuery, handleSubmit, loading }: QueryFormProps) {
  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about your travel plans..."
          disabled={loading}
          className="pr-10"
        />
      </div>
      <Button type="submit" size="icon" disabled={loading || !query.trim()}>
        {loading ? (
          <ClockLoader color="#ffffff" size={24} />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}