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

/**
 * Browse specific website and return the summary content
 * @param url website url
 */
export const browse = async (url: string) => {
  const chatStore = useChatStore();

  const html = await fetchContent(url);
  const text = extractText(html);

  const summary = await chatStore.summaryText(text);
  // TODO:
  const links = '';

  return `Website Content Summary: ${summary}\n\nLinks: ${links}`;
}
