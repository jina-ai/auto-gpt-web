import { defineStore } from 'pinia';
import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from 'openai';
import { v4 as uuidv4 } from 'uuid';

import { useAssistantStore } from './assistant';
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

interface Chat {
  thinking: boolean;
  history: HistoryItem[];
}

const createChatMsg = (role: ChatCompletionRequestMessageRoleEnum, content: string) => {
  return { role, content }
};

export const useChatStore = defineStore('chat', {
  state: (): Chat => {
    const assistantStore = useAssistantStore();

    return {
      thinking: false,
      history: [{
        id: uuidv4(),
        role: 'system',
        content: assistantStore.prompt,
        stamp: new Date(),
      }, {
        id: uuidv4(),
        role: 'system',
        content: 'Permanent memory: []',
        stamp: new Date(),
      }],
    }
  },
  getters: {
    lastHistoryItem(): HistoryItem | undefined {
      return this.history[this.history.length - 1];
    },

    hasHistory(): boolean {
      return this.history.length > 0;
    },

    context(state) {
      // TODO: calculate tokens and truncate if necessary
      return state.history.map((item) => {
        return createChatMsg(item.role, item.content);
      });
    }
  },
  actions: {
    async chat(role: ChatCompletionRequestMessageRoleEnum, input: string) {
      this.addHistoryItem({
        role,
        content: input,
        stamp: new Date(),
      })

      this.thinking = true;
      try {
        const result = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: this.context,
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
      } finally {
        this.thinking = false;
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
  persist: true,
});
