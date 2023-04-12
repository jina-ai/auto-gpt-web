export const google = async (query: string) => {
  // const endpoint = `https://www.googleapis.com/customsearch/v1?key=${credentialStore.google.key}&cx=${credentialStore.google.engine}&q=${encodeURIComponent(query)}`;

  // try {
  //   const response = await fetch(endpoint);
  //   if (response.ok) {
  //     const data = await response.json();
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     return data.items.map((item: any) => item.link);
  //   }
  // } catch (e) {
  //   if (e instanceof Error) {
  //     throw new Error(`Command <google> failed: ${e.message}`)
  //   }

  //   throw new Error('Command <google> failed due to unknown reason')
  // }

  const htmlString = await window.electronAPI.fetchHtmlString(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Remove unwanted elements such as scripts and styles
  const unwantedElements = doc.querySelectorAll('script, style, svg');
  unwantedElements.forEach((element) => element.remove());

  alert(doc.body.textContent?.length);
}
