import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { google } from '@ai-sdk/google';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': google('models/gemini-1.5-flash-latest'),
        'chat-model-reasoning': wrapLanguageModel({
          model: google('models/gemini-1.5-flash-latest'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': google('models/gemini-1.5-flash-latest'),
        'artifact-model': google('models/gemini-1.5-flash-latest'),
      },
      // imageModels: {
      //   'small-model': google('models/gemini-1.5-flash-latest'),
      // },
    });
