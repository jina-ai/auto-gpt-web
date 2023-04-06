import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from 'openai';
// TODO: allow user add keys on the webpage and save it to local storage
import { OPENAI_API_KEY } from '../keys.json';
import { useHistoryStore } from './stores/history';

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const historyStore = useHistoryStore();


const createChatMsg = (role: ChatCompletionRequestMessageRoleEnum, content: string) => {
  return { role, content }
};

export const chat = async ({
  prompt,
  userInput,
  fullMessageHistory,
  permanentMemory
}: {
  prompt: string;
  userInput: string;
  fullMessageHistory: string[];
  permanentMemory: string[];
}) => {
  // TODO: calculate tokens
  const currentContext = [
    createChatMsg('system', prompt),
    createChatMsg('system', `Permanent memory: ${permanentMemory.toString()}`)
  ]

  currentContext.push(createChatMsg('user', userInput));

  currentContext.forEach((msg) => {
    historyStore.add({
      ...msg,
      stamp: new Date(),
    });
  })

  const result = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: currentContext,
    max_tokens: 1000,
  });

  if (result.data.choices[0].message) {
    historyStore.add({
      ...result.data.choices[0].message,
      stamp: new Date(),
    })

    return result.data.choices[0].message?.['content'];
  }
}
