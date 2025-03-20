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
        if (tab.id !== undefined) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'SHOW',
            data: {
              lang: userTargetLang,
              translatedText: translatedText,
              originalText: selectedText,
            },
          });
        }
        break;
      }
    }
  }
});

chrome.runtime.onMessage.addListener(async function (message, sender) {
  if (message.type === 'TRANSLATE') {
    const selectedText = message.data.selectedText ?? '';
    const userTargetLang = await targetLangStorage.get();
    const translatedText = await translate(selectedText, userTargetLang);
    if (sender.tab?.id !== undefined) {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'SHOW',
        data: {
          lang: userTargetLang,
          translatedText: translatedText,
          originalText: selectedText,
        },
      });
    }
  }
});

chrome.runtime.onMessage.addListener(async function (message, sender) {
  if (message.type === 'SWITCH') {
    const selectedText = message.data.selectedText ?? '';
    const userTargetLang = message.data.targetLang ?? targetLangStorage.get();
    await targetLangStorage.set(userTargetLang);
    const translatedText = await translate(selectedText, userTargetLang);
    if (sender.tab?.id !== undefined) {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'SWITCHED',
        data: {
          lang: userTargetLang,
          translatedText: translatedText,
          originalText: selectedText,
        },
      });
    }
  }
});
