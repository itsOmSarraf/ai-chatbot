'use client';

import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { unstable_serialize } from 'swr/infinite';
// import { updateChatVisibility } from '@/app/(chat)/actions'; // This action was commented out
// import {
//   getChatHistoryPaginationKey,
//   type ChatHistory,
// } from '@/components/sidebar-history';
import type { VisibilityType } from '@/components/visibility-selector';

export function useChatVisibility({
  chatId,
  initialVisibility,
}: {
  chatId: string;
  initialVisibility: VisibilityType;
}) {
  const { mutate, cache } = useSWRConfig();
  // const history: ChatHistory = cache.get('/api/history')?.data; // History logic removed

  const { data: localVisibility, mutate: setLocalVisibility } = useSWR(
    `${chatId}-visibility`,
    null,
    {
      fallbackData: initialVisibility,
    },
  );

  // const visibilityType = useMemo(() => {
  //   if (!history) return localVisibility;
  //   const chat = history.chats.find((chat) => chat.id === chatId);
  //   if (!chat) return 'private';
  //   return chat.visibility;
  // }, [history, chatId, localVisibility]);
  const visibilityType = localVisibility; // Simplified visibility

  const setVisibilityType = (updatedVisibilityType: VisibilityType) => {
    setLocalVisibility(updatedVisibilityType);
    // mutate(unstable_serialize(getChatHistoryPaginationKey)); // History mutation removed

    // updateChatVisibility({
    //   chatId: chatId,
    //   visibility: updatedVisibilityType,
    // }); // Action call removed
  };

  return { visibilityType, setVisibilityType };
}
