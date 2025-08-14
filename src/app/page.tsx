import ChatLoader from '@/components/chat-loader';

export default function Home() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center p-4 md:p-8">
      <ChatLoader />
    </main>
  );
}
