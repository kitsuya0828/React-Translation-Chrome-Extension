import React from 'react';
import { createRoot } from 'react-dom/client';
import { ActionIcon, Image, Tooltip } from '@mantine/core';

import { Content } from './Content';

const Main = ({
  orect,
  translatedText,
  originalText,
  targetLang,
}: {
  orect: DOMRect;
  translatedText: string;
  originalText: string;
  targetLang: string;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        left: '0px',
        top: '0px',
        zIndex: 2147483550,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: window.scrollX + orect.left,
          top: window.scrollY + orect.bottom + 10,
          zIndex: 2147483550,
        }}
      >
        <Content
          translatedText={translatedText}
          originalText={originalText}
          targetLang={targetLang}
        />
      </div>
    </div>
  );
};

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  if (message.type === 'SHOW') {
    const selection = window.getSelection();
    if (selection !== undefined && selection !== null && selection.toString() !== undefined) {
      const oRange = selection.getRangeAt(0);
      const oRect = oRange.getBoundingClientRect();
      if (selection.toString().length === 0) {
        return;
      }
      for (let i = 0; i < document.getElementsByTagName('my-extension-root').length; i++) {
        document.getElementsByTagName('my-extension-root')[i].remove();
      }
      for (let i = 0; i < document.getElementsByTagName('my-extension-root-icon').length; i++) {
        document.getElementsByTagName('my-extension-root-icon')[i].remove();
      }
      const container = document.createElement('my-extension-root');
      document.body.after(container);
      createRoot(container).render(
        <Main
          orect={oRect}
          translatedText={message.data.translatedText.toString()}
          originalText={message.data.originalText.toString()}
          targetLang={message.data.lang.toString()}
        />
      );
    }
  }
});

document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection === undefined || selection === null) {
    return;
  }
  if (selection.toString().length > 0) {
    const oRange = selection.getRangeAt(0);
    const oRect = oRange.getBoundingClientRect();
    if (document.getElementsByTagName('my-extension-root-icon').length > 0) {
      return;
    }
    for (let i = 0; i < document.getElementsByTagName('my-extension-root').length; i++) {
      document.getElementsByTagName('my-extension-root')[i].remove();
    }
    const container = document.createElement('my-extension-root-icon');
    document.body.after(container);
    createRoot(container).render(<Icon selectedText={selection.toString()} orect={oRect} />);
  }
});

const Icon = ({ selectedText, orect }: { selectedText: string; orect: DOMRect }) => {
  const handleClick = async () => {
    for (let i = 0; i < document.getElementsByTagName('my-extension-root-icon').length; i++) {
      document.getElementsByTagName('my-extension-root-icon')[i].remove();
    }
    chrome.runtime.sendMessage({
      type: 'TRANSLATE',
      data: {
        selectionText: selectedText,
      },
    });
  };
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        left: '0px',
        top: '0px',
        zIndex: 2147483550,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: window.scrollX + orect.right,
          top: window.scrollY + orect.bottom,
          zIndex: 2147483550,
        }}
      >
        <Tooltip label="選択したテキストを翻訳" withArrow>
          <ActionIcon
            radius="xl"
            variant="default"
            size="lg"
            sx={{
              boxShadow: '0 0 10px rgba(0,0,0,.3);',
              zIndex: 2147483550,
            }}
            onClick={handleClick}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                zIndex: 2147483550,
              }}
            >
              <Image src={chrome.runtime.getURL('images/extension_128.png')} />
            </div>
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  );
};
