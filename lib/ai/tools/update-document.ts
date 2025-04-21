import { tool } from 'ai';
import type { DataStreamWriter } from 'ai';
import type { Session } from 'next-auth';
import { z } from 'zod';
import { documentHandlersByArtifactKind } from '@/lib/artifacts/server';

interface UpdateDocumentProps {
  session: Session;
  dataStream: DataStreamWriter;
}

// Mock document interface
interface Document {
  id: string;
  title: string;
  content: string;
  kind: string;
  createdAt: Date;
}

export const updateDocument = ({ session, dataStream }: UpdateDocumentProps) =>
  tool({
    description: 'Update a document with the given description.',
    parameters: z.object({
      id: z.string().describe('The ID of the document to update'),
      description: z
        .string()
        .describe('The description of changes that need to be made'),
    }),
    execute: async ({ id, description }) => {
      // Mock document data instead of DB query
      const document: Document = {
        id,
        title: 'Mock Document',
        content: 'This is some sample content that will be updated.',
        kind: 'text',
        createdAt: new Date(),
      };

      if (!document) {
        return {
          error: 'Document not found',
        };
      }

      dataStream.writeData({
        type: 'clear',
        content: document.title,
      });

      const documentHandler = documentHandlersByArtifactKind.find(
        (documentHandlerByArtifactKind) =>
          documentHandlerByArtifactKind.kind === document.kind,
      );

      if (!documentHandler) {
        throw new Error(`No document handler found for kind: ${document.kind}`);
      }

      await documentHandler.onUpdateDocument({
        document,
        description,
        dataStream,
      });

      dataStream.writeData({ type: 'finish', content: '' });

      // DB save operation removed
      console.log('Document updated:', id);

      return {
        id,
        title: document.title,
        kind: document.kind,
        content: 'The document has been updated successfully.',
      };
    },
  });
