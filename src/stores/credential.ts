import { defineStore } from 'pinia';

export interface Credentials {
  openai: string;
}

export const useCredentialStore = defineStore('credential', {
  state: (): Credentials => ({
    openai: ''
  }),
  getters: {
    requireOpenAICredential(): boolean {
      return this.openai === '';
    }
  },
  actions: {
    setOpenAI(key: string) {
      this.openai = key;
    },
    clear() {
      this.openai = '';
    }
  },
  persist: true,
});
