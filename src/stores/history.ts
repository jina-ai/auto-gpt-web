import { defineStore } from 'pinia';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

interface HistoryItem {
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
      this.list.push(item);
    }
  },
});
