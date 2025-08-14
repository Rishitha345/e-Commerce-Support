"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { ArrowUp, Package, Search, Sparkles, Undo2, User } from "lucide-react";
import { getAiResponse } from "@/lib/actions";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

type QuickAction = {
  label: string;
  action: string;
  icon: React.ReactNode;
};

const quickActions: QuickAction[] = [
  { label: "Track my order", action: "How can I track my recent order?", icon: <Package className="w-4 h-4" /> },
  { label: "Search products", action: "I'm looking for a new pair of headphones.", icon: <Search className="w-4 h-4" /> },
  { label: "Start a return", action: "I need to return an item.", icon: <Undo2 className="w-4 h-4" /> },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: "Hello! I'm ShopAssist, your personal AI shopping helper. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageContent,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const aiResponse = await getAiResponse(newMessages);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiResponse,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response from the assistant.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
    setInput("");
  };

  const handleQuickActionClick = (action: string) => {
    handleSendMessage(action);
  };

  return (
    <Card className="w-full max-w-3xl h-full max-h-[700px] flex flex-col shadow-2xl rounded-2xl">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary/50">
             <AvatarImage asChild><Sparkles className="w-full h-full p-2.5 text-primary" /></AvatarImage>
          </Avatar>
          <div>
            <CardTitle className="font-headline text-2xl text-foreground">ShopAssist</CardTitle>
            <CardDescription className="text-muted-foreground">Your AI-powered shopping assistant</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full" viewportProps={{ref: scrollAreaRef}}>
          <div className="p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex items-start gap-3", message.role === "user" && "justify-end")}>
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8">
                     <AvatarImage asChild><Sparkles className="w-full h-full p-1.5 bg-accent text-accent-foreground rounded-full" /></AvatarImage>
                  </Avatar>
                )}
                <div className={cn(
                  "max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl",
                  message.role === "user" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-muted-foreground rounded-bl-none"
                )}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                 {message.role === "user" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
               <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage asChild><Sparkles className="w-full h-full p-1.5 bg-accent text-accent-foreground rounded-full" /></AvatarImage>
                  </Avatar>
                  <div className="bg-muted text-muted-foreground px-4 py-3 rounded-2xl rounded-bl-none">
                    <div className="flex items-center gap-2">
                       <span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:-0.3s]"></span>
                       <span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:-0.15s]"></span>
                       <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                    </div>
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4 border-t pt-6">
         <div className="flex flex-wrap gap-2">
            {quickActions.map((qa) => (
                <Button key={qa.label} variant="outline" size="sm" onClick={() => handleQuickActionClick(qa.action)} disabled={isLoading} className="gap-2 bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                  {qa.icon}
                  {qa.label}
                </Button>
            ))}
        </div>
        <form onSubmit={handleSubmit} className="w-full flex items-center gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={isLoading}
            className="flex-1 rounded-full px-4"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-full bg-accent hover:bg-accent/90">
            <ArrowUp className="w-5 h-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
