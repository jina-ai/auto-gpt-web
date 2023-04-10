import { useChatStore } from '../stores/chat';

const PROXY = 'https://young-stream-68812.herokuapp.com'

const fetchContent = async (url: string) => {
  const response = await fetch(`${PROXY}/${url}`);
  const html = await response.text();
  return html;
}

const extractText = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove unwanted elements such as scripts and styles
  const unwantedElements = doc.querySelectorAll('script, style');
  unwantedElements.forEach((element) => element.remove());

  // Extract text from the remaining elements
  const text = doc.body.textContent?.trim();

  return text ?? '';
}

const extractLinks = (html: string) => {
  debugger
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const links = doc.querySelectorAll('a');
  return Array.from(links).map((link) => ({
    text: link.textContent?.trim(),
    link: link.getAttribute('href'),
  }));
}

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

const summaryText = async (text: string) => {
  const chatStore = useChatStore();

  text = text.trim();
  if (!text) {
    throw new Error('Summary failed: empty text');
  }

  const chunks = splitText(text);

  const index = 0;
  const summaries = [];
  for (const chunk of chunks) {
    const result = await chatStore.openai.createChatCompletion({
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

  const finalResult = await chatStore.openai.createChatCompletion({
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

  return finalResult.data.choices[0].message?.['content'];
}

/**
 * Browse specific website and return the summary content
 * @param url website url
 */
export const browse = async (url: string) => {
  const html = await fetchContent(url);
  const text = extractText(html);

  const summary = await summaryText(text);
  const links = extractLinks(text);

  let result = `Website Content Summary:\n${summary}`;

  if (links.length) {
    result += `Links:\n${links}`
  }

  return result;
}
