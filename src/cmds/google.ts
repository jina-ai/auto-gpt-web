import { useCredentialStore } from '../stores/credential';

export const google = async (query: string) => {
  const credentialStore = useCredentialStore();

  const endpoint = `https://www.googleapis.com/customsearch/v1?key=${credentialStore.google.key}&cx=${credentialStore.google.engine}&q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.items.map((item: any) => item.link);
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Command <google> failed: ${e.message}`)
    }

    throw new Error('Command <google> failed due to unknown reason')
  }
}
