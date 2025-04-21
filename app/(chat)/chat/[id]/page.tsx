import { notFound } from 'next/navigation';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { DataStreamHandler } from '@/components/data-stream-handler';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  // Simplified implementation without DB or auth checks
  return (
    <>
      <Chat
        id={id}
        initialMessages={[]}
        selectedChatModel={DEFAULT_CHAT_MODEL}
        selectedVisibilityType="public"
        isReadonly={false}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
