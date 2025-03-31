// components/ChatHistory.tsx
import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatHistoryProps {
  history: Array<{query: string, response: string}>;
}

export default function ChatHistory({ history }: ChatHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <ScrollArea className="h-[60vh] rounded-lg border bg-background">
      <div className="p-4 space-y-4" ref={scrollRef}>
        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={index} className="space-y-4">
                {/* User message */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-muted p-3 text-sm max-w-[80%]">
                    {item.query}
                  </div>
                </div>
                
                {/* AI response */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/bot-avatar.png" alt="AI" />
                    <AvatarFallback className="bg-secondary text-secondary-foreground">AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-card p-4 text-sm max-w-[80%] shadow-sm">
                    <div className="prose prose-sm dark:prose-invert">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => (
                            <a 
                              {...props} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary underline underline-offset-2 hover:text-primary/80"
                            />
                          ),
                          h1: ({ node, ...props }) => (
                            <h1 {...props} className="text-xl font-bold mt-4 mb-2" />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 {...props} className="text-lg font-bold mt-3 mb-2" />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3 {...props} className="text-md font-bold mt-3 mb-1" />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul {...props} className="list-disc pl-5 my-2" />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol {...props} className="list-decimal pl-5 my-2" />
                          ),
                          li: ({ node, ...props }) => (
                            <li {...props} className="my-1" />
                          ),
                          hr: ({ node, ...props }) => (
                            <hr {...props} className="my-3 border-muted-foreground/20" />
                          ),
                          code: ({ node, inline, className, children, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode } & React.HTMLProps<HTMLElement>) => (
                            inline ? 
                              <code {...props} className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code> :
                              <code {...props} className="block bg-muted p-2 rounded-md text-sm font-mono overflow-x-auto">{children}</code>
                          ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote {...props} className="border-l-4 border-muted-foreground/20 pl-3 italic" />
                          ),
                        }}
                      >
                        {item.response}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>Ask me anything about your travel plans!</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}