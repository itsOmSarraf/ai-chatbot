'use client';

import { useRouter } from 'next/navigation';
import {
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from '@/components/ui/sidebar';

export function SidebarHistory() {
  const { setOpenMobile } = useSidebar();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
          Chat history is unavailable.
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
