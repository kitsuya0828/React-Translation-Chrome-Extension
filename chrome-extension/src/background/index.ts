import { translate } from './translate';
import { targetLangStorage } from '@extension/storage';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'translation',
    title: '選択したテキストを翻訳',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (tab !== undefined) {
    switch (info.menuItemId) {
      case 'translation': {
        const selectedText = info.selectionText ?? '';
        const userTargetLang = await targetLangStorage.get();
        const translatedText = await translate(selectedText, userTargetLang);
        console.log('翻訳結果: ' + translatedText);
        break;
      }
    }
  }
});
