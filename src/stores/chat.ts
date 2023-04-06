import { defineStore } from 'pinia';
import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from 'openai';
import { v4 as uuidv4 } from 'uuid';
// TODO: allow user add keys on the webpage and save it to local storage
import { OPENAI_API_KEY } from '../../keys.json';

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface HistoryItem {
  id: string;
  role: ChatCompletionRequestMessageRoleEnum;
  content: string;
  stamp: Date;
}

interface History {
  history: HistoryItem[];
}

const createChatMsg = (role: ChatCompletionRequestMessageRoleEnum, content: string) => {
  return { role, content }
};

export const useChatStore = defineStore('chat', {
  state: (): History => ({
    history: [],
  }),
  getters: {
    hasHistory(): boolean {
      return this.history.length > 0;
    }
  },
  actions: {
    async chat({
      prompt,
      userInput,
      permanentMemory
    }: {
      prompt: string;
      userInput: string;
      permanentMemory: string[];
    }) {
      // TODO: calculate tokens
      const currentContext = [
        createChatMsg('system', prompt),
        createChatMsg('system', `Permanent memory: ${permanentMemory.toString()}`)
      ]

      currentContext.push(createChatMsg('user', userInput));

      currentContext.forEach((msg) => {
        this.addHistoryItem({
          ...msg,
          stamp: new Date(),
        });
      })

      const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: currentContext,
        // TODO:
        max_tokens: 1000,
      });

      if (result.data.choices[0].message) {
        this.addHistoryItem({
          ...result.data.choices[0].message,
          stamp: new Date(),
        })

        return result.data.choices[0].message?.['content'];
      }
    },

    addHistoryItem(item: Omit<HistoryItem, 'id'>) {
      this.history.push({
        ...item,
        id: uuidv4(),
      });
    },
    clearHistory() {
      this.history = [];
    },
  },
});
