import { defineStore } from 'pinia';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { v4 as uuidv4 } from 'uuid';

interface HistoryItem {
  id: string;
  role: ChatCompletionRequestMessageRoleEnum;
  content: string;
  stamp: Date;
}

interface History {
  list: HistoryItem[];
}

export const useHistoryStore = defineStore('history', {
  state: (): History => ({
    list: [],
  }),
  actions: {
    add(item: HistoryItem) {
      this.list.push({
        ...item,
        id: uuidv4(),
      });
    },
    clear() {
      this.list = [];
    },
  },
});
