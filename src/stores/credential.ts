import { defineStore } from 'pinia';

export interface Credentials {
  openai: string;
  google: {
    key: string;
    engine: string;
  }
}

export const useCredentialStore = defineStore('credential', {
  state: (): Credentials => ({
    openai: '',
    google: {
      key: '',
      engine: '',
    }
  }),
  getters: {
    requireOpenAICredential(): boolean {
      return this.openai === '';
    }
  },
  actions: {
  },
  persist: true,
});
