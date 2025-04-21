import {
  UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
    } = await request.json();

    // Mock user ID since auth is removed
    const mockUserId = 'user-123';

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response('No user message found', { status: 400 });
    }

    // DB operations removed
    const title = await generateTitleFromUserMessage({
      message: userMessage,
    });

    // Mock session object
    const mockSession = {
      user: { id: mockUserId },
      expires: new Date().toISOString(),
    };

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt({ selectedChatModel }),
          messages,
          maxSteps: 5,
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning'
              ? []
              : [
                  'getWeather',
                  'createDocument',
                  'updateDocument',
                  'requestSuggestions',
                ],
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
          tools: {
            getWeather,
            createDocument: createDocument({
              session: mockSession,
              dataStream,
            }),
            updateDocument: updateDocument({
              session: mockSession,
              dataStream,
            }),
            requestSuggestions: requestSuggestions({
              session: mockSession,
              dataStream,
            }),
          },
          onFinish: async ({ response }) => {
            try {
              const assistantId = getTrailingMessageId({
                messages: response.messages.filter(
                  (message) => message.role === 'assistant',
                ),
              });

              if (!assistantId) {
                throw new Error('No assistant message found!');
              }

              const [, assistantMessage] = appendResponseMessages({
                messages: [userMessage],
                responseMessages: response.messages,
              });

              // DB operations removed
              console.log('Chat message processed:', assistantId);
            } catch (_) {
              console.error('Failed to process chat');
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: () => {
        return 'Oops, an error occurred!';
      },
    });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 404,
    });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  // Mock user ID since auth is removed
  const mockUserId = 'user-123';

  try {
    // DB operations removed
    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}
