"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ChatInterface = dynamic(() => import('@/components/chat-interface'), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-3xl h-full max-h-[700px] flex flex-col gap-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </div>
      <Skeleton className="flex-1 w-full rounded-2xl" />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
            <Skeleton className="h-9 w-36 rounded-md" />
            <Skeleton className="h-9 w-40 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-md" />
        </div>
        <div className="flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  ),
});

export default function ChatLoader() {
  return <ChatInterface />;
}
