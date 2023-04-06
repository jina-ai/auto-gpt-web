import { defineStore } from 'pinia';
import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from 'openai';
import { v4 as uuidv4 } from 'uuid';

import { useCredentialStore } from './credential';

interface HistoryItem {
  id: string;
  role: ChatCompletionRequestMessageRoleEnum;
  content: string;
  stamp: Date;
}

interface Chat {
  openai?: OpenAIApi;
  thinking: boolean;
  history: HistoryItem[];
}

const createChatMsg = (role: ChatCompletionRequestMessageRoleEnum, content: string) => {
  return { role, content }
};

export const useChatStore = defineStore('chat', {
  state: (): Chat => {
    return {
      thinking: false,
      history: [],
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
    async chat(list?: { role: ChatCompletionRequestMessageRoleEnum, content: string }[]) {
      if (!this.openai) {
        const credentialStore = useCredentialStore();
        if (credentialStore.requireOpenAICredential) {
          throw Error('OpenAI API key is not set');
        }

        const configuration = new Configuration({
          apiKey: credentialStore.openai,
        });
        this.openai = new OpenAIApi(configuration);
      }

      list?.forEach(({ role, content }) => {
        this.addHistoryItem({
          role,
          content: content,
          stamp: new Date(),
        })
      })

      this.thinking = true;
      try {
        const result = await this.openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: this.context,
          // TODO:
          max_tokens: 1000,
        });

        if (result.data.choices[0].message?.['content']) {
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

    addBasicPrompt(content: string) {
      this.history.unshift({
        id: uuidv4(),
        role: 'system',
        content: content,
        stamp: new Date(),
      }, {
        id: uuidv4(),
        role: 'system',
        content: 'Permanent memory: []',
        stamp: new Date(),
      }, {
        id: uuidv4(),
        role: 'user',
        content: 'Determine which next command to use, and respond using the format specified above:',
        stamp: new Date(),
      })
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
