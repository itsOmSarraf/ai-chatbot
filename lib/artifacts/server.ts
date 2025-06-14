import { codeDocumentHandler } from '@/artifacts/code/server';
import { imageDocumentHandler } from '@/artifacts/image/server';
import { sheetDocumentHandler } from '@/artifacts/sheet/server';
import { textDocumentHandler } from '@/artifacts/text/server';
import type { ArtifactKind } from '@/components/artifact';
import type { DataStreamWriter } from 'ai';

export interface SaveDocumentProps {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  // userId: string; // Removed userId
}

export interface CreateDocumentCallbackProps {
  id: string;
  title: string;
  dataStream: DataStreamWriter;
  // session: Session; // Removed session
}

export interface UpdateDocumentCallbackProps {
  // document: Document; // Document type removed
  document: any; // Changed Document type to any
  description: string;
  dataStream: DataStreamWriter;
  // session: Session; // Removed session
}

export interface DocumentHandler<T = ArtifactKind> {
  kind: T;
  onCreateDocument: (args: CreateDocumentCallbackProps) => Promise<void>;
  onUpdateDocument: (args: UpdateDocumentCallbackProps) => Promise<void>;
}

export function createDocumentHandler<T extends ArtifactKind>(config: {
  kind: T;
  onCreateDocument: (params: CreateDocumentCallbackProps) => Promise<string>;
  onUpdateDocument: (params: UpdateDocumentCallbackProps) => Promise<string>;
}): DocumentHandler<T> {
  return {
    kind: config.kind,
    onCreateDocument: async (args: CreateDocumentCallbackProps) => {
      const draftContent = await config.onCreateDocument({
        id: args.id,
        title: args.title,
        dataStream: args.dataStream,
        // session: args.session, // Removed session
      });

      // if (args.session?.user?.id) { // Removed session check
      // await saveDocument({ // Removed saveDocument call
      //   id: args.id,
      //   title: args.title,
      //   content: draftContent,
      //   kind: config.kind,
      //   userId: args.session.user.id,
      // });
      // }

      return;
    },
    onUpdateDocument: async (args: UpdateDocumentCallbackProps) => {
      const draftContent = await config.onUpdateDocument({
        document: args.document,
        description: args.description,
        dataStream: args.dataStream,
        // session: args.session, // Removed session
      });

      // if (args.session?.user?.id) { // Removed session check
      // await saveDocument({ // Removed saveDocument call
      //   id: args.document.id,
      //   title: args.document.title,
      //   content: draftContent,
      //   kind: config.kind,
      //   userId: args.session.user.id,
      // });
      // }

      return;
    },
  };
}

/*
 * Use this array to define the document handlers for each artifact kind.
 */
export const documentHandlersByArtifactKind: Array<DocumentHandler> = [
  textDocumentHandler,
  codeDocumentHandler,
  imageDocumentHandler,
  sheetDocumentHandler,
];

export const artifactKinds = ['text', 'code', 'image', 'sheet'] as const;
