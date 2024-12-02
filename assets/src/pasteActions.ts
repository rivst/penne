import QRCode from 'qrcode';

import { decryptPaste } from './crypto';

import type { PasteContent } from './types';

const pasteToFile = (title: string, contents: string): void => {
  const fileContents = `${title}\n\n${contents}`;

  const url = URL.createObjectURL(
    new Blob([fileContents], { type: 'text/plain;charset=utf-8' })
  );

  const link = document.createElement('a');
  link.href = url;
  link.download = `${title}.txt`;
  link.click();
  URL.revokeObjectURL(url);
};

const pasteLinkToQr = (): void => {
  const qrCanvas = document.getElementById('qrCanvas') as HTMLCanvasElement;
  console.log(qrCanvas);
  qrCanvas.classList.remove('d-none');
  QRCode.toCanvas(qrCanvas, window.location.href);
};

const processEncryptedPaste = (title: string, text: string): void => {
  const { decryptedTitle, decryptedText } = decryptPaste(title, text);

  if (decryptedTitle && decryptedText) {
    const titleElement = document.getElementById('pasteTitle');
    const contentsElement = document.getElementById('pasteContents');

    if (titleElement && contentsElement) {
      titleElement.innerText = decryptedTitle;
      contentsElement.innerText = decryptedText;
    }
  }
};

const getPasteFromPage = (): PasteContent => {
  const titleElement = document.getElementById('pasteTitle');
  const contentsElement = document.getElementById('pasteContents');

  return {
    title: titleElement?.innerText ?? '',
    contents: contentsElement?.innerText ?? '',
  };
};

export { pasteToFile, pasteLinkToQr, processEncryptedPaste };
