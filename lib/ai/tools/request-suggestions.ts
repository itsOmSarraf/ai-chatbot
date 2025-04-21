import { z } from 'zod';
import { Session } from 'next-auth';
import { DataStreamWriter, streamObject, tool } from 'ai';
import { generateUUID } from '@/lib/utils';
import { myProvider } from '../providers';

interface RequestSuggestionsProps {
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

export const requestSuggestions = ({
  session,
  dataStream,
}: RequestSuggestionsProps) =>
  tool({
    description: 'Request suggestions for a document',
    parameters: z.object({
      documentId: z
        .string()
        .describe('The ID of the document to request edits'),
    }),
    execute: async ({ documentId }) => {
      // Mock document data instead of DB query
      const document: Document = {
        id: documentId,
        title: 'Mock Document',
        content:
          'This is a sample document content. It needs improvement. The sentences could be better structured.',
        kind: 'text',
        createdAt: new Date(),
      };

      if (!document || !document.content) {
        return {
          error: 'Document not found',
        };
      }

      const suggestions = [];

      const { elementStream } = streamObject({
        model: myProvider.languageModel('artifact-model'),
        system:
          'You are a help writing assistant. Given a piece of writing, please offer suggestions to improve the piece of writing and describe the change. It is very important for the edits to contain full sentences instead of just words. Max 5 suggestions.',
        prompt: document.content,
        output: 'array',
        schema: z.object({
          originalSentence: z.string().describe('The original sentence'),
          suggestedSentence: z.string().describe('The suggested sentence'),
          description: z.string().describe('The description of the suggestion'),
        }),
      });

      for await (const element of elementStream) {
        const suggestion = {
          originalText: element.originalSentence,
          suggestedText: element.suggestedSentence,
          description: element.description,
          id: generateUUID(),
          documentId: documentId,
          isResolved: false,
        };

        dataStream.writeData({
          type: 'suggestion',
          content: suggestion,
        });

        suggestions.push(suggestion);
      }

      // DB save operations removed
      console.log('Generated suggestions:', suggestions.length);

      return {
        id: documentId,
        title: document.title,
        kind: document.kind,
        message: 'Suggestions have been added to the document',
      };
    },
  });
