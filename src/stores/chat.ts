import { defineStore } from 'pinia';
import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from 'openai';
import { v4 as uuidv4 } from 'uuid';

import { useCredentialStore } from './credential';
import { exec, Command } from '../cmds';

interface HistoryItem {
  id: string;
  role: ChatCompletionRequestMessageRoleEnum;
  content: string;
  stamp: Date;
}

interface Chat {
  _openai?: OpenAIApi;
  /**
   * If the OpenAI is thinking
   */
  thinking: boolean;
  /**
   * If the human is deciding whether to continue
   */
  deciding: boolean;
  /**
   * If the command is being executed
   */
  executing: boolean;
  currentCommandJson: string;
  history: HistoryItem[];
}

const createChatMsg = (role: ChatCompletionRequestMessageRoleEnum, content: string) => {
  return { role, content }
};

const splitText = (text: string, maxLength = 8192) => {
  const paragraphs = text.split('\n');
  let currentLength = 0;
  let currentChunk: string[] = [];
  const result: string[] = [];

  for (const paragraph of paragraphs) {
    if (currentLength + paragraph.length + 1 <= maxLength) {
      currentChunk.push(paragraph);
      currentLength += paragraph.length + 1;
    } else {
      result.push(currentChunk.join('\n'));
      currentChunk = [paragraph];
      currentLength = paragraph.length + 1;
    }
  }

  if (currentChunk.length > 0) {
    result.push(currentChunk.join('\n'));
  }

  return result;
}

export const useChatStore = defineStore('chat', {
  state: (): Chat => {
    return {
      thinking: false,
      deciding: false,
      executing: false,
      currentCommandJson: '',
      history: [],
    }
  },
  getters: {
    openai(): OpenAIApi {
      if (!this._openai) {
        const credentialStore = useCredentialStore();
        if (credentialStore.requireOpenAICredential) {
          throw Error('OpenAI API key is not set');
        }

        const configuration = new Configuration({
          apiKey: credentialStore.openai,
        });
        this._openai = new OpenAIApi(configuration);
      }

      return this._openai as OpenAIApi;
    },

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
    },

    currentCommand(state) {
      if (state.currentCommandJson) {
        return JSON.parse(state.currentCommandJson).command as Command;
      }

      return null;
    }
  },
  actions: {
    async chat(list?: { role: ChatCompletionRequestMessageRoleEnum, content: string }[]) {
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

          this.currentCommandJson = result.data.choices[0].message?.['content'];
        }
      } finally {
        // It's time for the user to decide once AI gives response
        this.deciding = true;
        this.thinking = false;
      }
    },

    async exec() {
      this.executing = true;

      if (!this.currentCommand) {
        return;
      }

      try {
        const result = await exec(this.currentCommand);
        this.addHistoryItem({
          role: 'system',
          content: result ? `Command returned: ${result}` : 'Unable to execute command',
          stamp: new Date(),
        });
      } finally {
        this.executing = false;
      }
    },

    async summaryText(text: string) {
      text = text.trim();
      if (!text) {
        throw new Error('Summary failed: empty text');
      }

      const chunks = splitText(text);

      const index = 0;
      const summaries = [];
      for (const chunk of chunks) {
        const result = await this.openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              'role': 'user',
              'content': 'Please summarize the following website text, do not describe the general website, but instead concisely extract the specific information this page contains: \n' +
                chunk
            },
          ],
          max_tokens: 300,
        });

        const summary = result.data.choices[0].message?.['content'];
        console.log(`Summary of chunk ${index}: ${summary}`)

        summaries.push(summary);
      }

      const finalResult = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            'role': 'user',
            'content': 'Please summarize the following website text, do not describe the general website, but instead concisely extract the specific information this page contains: \n' +
              summaries.join('\n')
          },
        ],
        max_tokens: 300,
      });

      if (finalResult.data.choices[0].message?.['content']) {
        this.addHistoryItem({
          ...finalResult.data.choices[0].message,
          stamp: new Date(),
        })
      }

      return finalResult.data.choices[0].message?.['content'];
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
