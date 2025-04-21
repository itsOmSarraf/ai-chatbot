'use client';

import { isAfter } from 'date-fns';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { useWindowSize } from 'usehooks-ts';

// import type { Document } from '@/lib/db/schema';
// import { getDocumentTimestampByIndex } from '@/lib/utils';

import { LoaderIcon } from './icons';
import { Button } from './ui/button';
import { useArtifact } from '@/hooks/use-artifact';
import { PlaceholderDocument } from './artifact'; // Assuming PlaceholderDocument is exported or defined here

interface VersionFooterProps {
  handleVersionChange: (type: 'next' | 'prev' | 'toggle' | 'latest') => void;
  // documents: Array<Document> | undefined;
  document: PlaceholderDocument | undefined; // Use placeholder from artifact.tsx
  versions: number;
  currentVersionIndex: number;
}

export const VersionFooter = ({
  handleVersionChange,
  // documents,
  document,
  versions,
  currentVersionIndex,
}: VersionFooterProps) => {
  // const { artifact } = useArtifact();
  // const { width } = useWindowSize();
  // const isMobile = width < 768;
  // const { mutate } = useSWRConfig();
  // const [isMutating, setIsMutating] = useState(false);

  // Remove all rendering and logic as versioning is disabled
  // if (!documents) return;
  // return (
  // ... original JSX removed ...
  // );

  return null; // Render nothing
};
