import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HelpCircle } from "lucide-react";
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
    <Card className="border-none shadow-md">
      <ScrollArea className="h-[70vh] rounded-lg bg-background">
        <div className="p-6 space-y-6" ref={scrollRef}>
          {history.length > 0 ? (
            <div className="space-y-6">
              {history.map((item, index) => (
                <div key={index} className="space-y-6">
                  {/* User message */}
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-medium">U</AvatarFallback>
                    </Avatar>
                    <div className="rounded-xl bg-muted/50 p-4 text-sm max-w-[80%] relative shadow-sm border border-muted/30">
                      <div className="font-medium text-foreground/90">
                        {item.query}
                      </div>
                      {/* <Badge variant="outline" className="absolute -top-2 -left-1 text-xs bg-background">You</Badge> */}
                    </div>
                  </div>
                  
                  {/* AI response */}
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 border-2 border-secondary/10 shadow-sm">
                      <AvatarImage src="/bot-avatar.png" alt="AI" className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground font-medium">AI</AvatarFallback>
                    </Avatar>
                    <CardContent className="rounded-xl bg-card p-5 text-sm max-w-[80%] shadow-md border border-accent/10 relative">
                      <Badge variant="secondary" className="absolute -top-2 -left-1 text-xs bg-background">Assistant</Badge>
                      <div className="prose prose-sm dark:prose-invert">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ node, ...props }) => (
                              <a 
                                {...props} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                              />
                            ),
                            h1: ({ node, ...props }) => (
                              <h1 {...props} className="text-xl font-bold mt-6 mb-3" />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2 {...props} className="text-lg font-bold mt-5 mb-2" />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3 {...props} className="text-md font-bold mt-4 mb-2" />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul {...props} className="list-disc pl-6 my-3 space-y-1" />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol {...props} className="list-decimal pl-6 my-3 space-y-1" />
                            ),
                            li: ({ node, ...props }) => (
                              <li {...props} className="my-1" />
                            ),
                            hr: ({ node, ...props }) => (
                              <Separator className="my-4" />
                            ),
                            code: ({ node, inline, className, children, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode } & React.HTMLProps<HTMLElement>) => (
                              inline ? 
                                <code {...props} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code> :
                                <div className="relative my-3">
                                  <pre className="bg-muted/70 p-3 rounded-lg text-sm font-mono overflow-x-auto border border-muted">{children}</pre>
                                </div>
                            ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote {...props} className="border-l-4 border-primary/20 pl-4 italic text-muted-foreground my-3" />
                            ),
                          }}
                        >
                          {item.response}
                        </ReactMarkdown>
                      </div>
                    </CardContent>
                  </div>
                  
                  {index < history.length - 1 && (
                    <Separator className="my-2 opacity-30" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="bg-primary/5 p-6 rounded-full mb-4">
                <HelpCircle className="text-primary w-8 h-8" />
              </div>
              <p className="text-lg font-medium text-foreground/80">No conversation yet</p>
              <p className="text-muted-foreground mt-2">Ask me anything about your travel plans!</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}