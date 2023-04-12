import { BrowserView, BrowserWindow } from 'electron';


/**
 * Using BrowserView to get the html string
 * @param url website url
 */
export const fetchHtmlString = async (window: BrowserWindow, url: string) => {
  const browserView = new BrowserView();
  browserView.setBackgroundColor('#fff');
  browserView.webContents.loadURL(url);

  window.setBrowserView(browserView);
  browserView.setBounds({ x: 0, y: 0, width: window.getBounds().width, height: window.getBounds().height });

  return new Promise<string>((resolve, reject) => {
    browserView.webContents.on('did-finish-load', async () => {
      const htmlString = await browserView.webContents.executeJavaScript('document.documentElement.outerHTML');
      resolve(htmlString);
    })

    browserView.webContents.on('render-process-gone', (event, details) => {
      reject(`BrowserView render process gone: ${details.reason}`);
    })
  })
}
