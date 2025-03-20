import { createRoot } from 'react-dom/client';
import type { DialogBoxProps } from '@src/DialogBox';
import { DialogBox } from '@src/DialogBox';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { useState, useEffect } from 'react';
import { showIconStorage } from '@extension/storage';
import { ClickAwayListener } from '@mui/material';
import { Icon } from '@src/Icon';

const root = document.createElement('chrome-extension-boilerplate-react-vite-content-view-root');
root.style.zIndex = '2147483647';
document.body.after(root);

const shadowRootElement = document.createElement('div');
shadowRootElement.id = 'shadow-root';
const shadowContainer = root.attachShadow({ mode: 'open' });
shadowContainer.appendChild(shadowRootElement);

const cache = createCache({ key: 'shadow-css', prepend: true, container: shadowContainer });
const theme = createTheme({
  cssVariables: { rootSelector: '#shadow-root', colorSchemeSelector: 'class' },
  components: {
    MuiPopover: { defaultProps: { container: shadowRootElement, style: { zIndex: 2147483647 } } },
    MuiPopper: { defaultProps: { container: shadowRootElement, style: { zIndex: 2147483647 } } },
  },
});

const App = () => {
  const [mode, setMode] = useState<'dialog' | 'icon' | 'idle'>('idle');
  const [data, setData] = useState<DialogBoxProps | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [iconPosition, setIconPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const showIcon = showIconStorage.getSnapshot() ?? true;

  const handleDialogClose = () => {
    setMode('idle');
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener = (message: any) => {
      if (message.type === 'SHOW') {
        const data: DialogBoxProps = {
          translatedText: message.data.translatedText.toString(),
          originalText: message.data.originalText.toString(),
          targetLang: message.data.lang.toString(),
          onClose: handleDialogClose,
        };
        if (rect === null) {
          setRect(window.getSelection()?.getRangeAt(0).getBoundingClientRect() ?? null);
        }
        setData(data);
        setMode('dialog');
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [rect]);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        setSelectedText(selection.toString());
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        setRect(rect);
        setIconPosition({ x: rect.right, y: rect.bottom });
        setMode('icon');
      }
    };
    if (mode !== 'dialog') {
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [mode]);

  const handleIconClick = () => {
    setMode('idle');
    setIconPosition(null);
    chrome.runtime.sendMessage({
      type: 'TRANSLATE',
      data: {
        selectedText: selectedText,
      },
    });
  };

  return (
    <>
      {mode === 'dialog' && data !== null && rect !== null && (
        <div style={{ position: 'absolute', width: '100%', left: '0px', top: '0px', zIndex: 2147483550 }}>
          <div
            style={{
              position: 'absolute',
              left: window.scrollX + rect.left,
              top: window.scrollY + rect.bottom + 10,
              zIndex: 2147483550,
            }}>
            <DialogBox {...data} />
          </div>
        </div>
      )}
      {mode === 'icon' && iconPosition !== null && showIcon && (
        <ClickAwayListener onClickAway={() => setMode('idle')} mouseEvent="onMouseDown">
          <div
            style={{
              position: 'absolute',
              left: window.scrollX + iconPosition.x,
              top: window.scrollY + iconPosition.y,
              zIndex: 2147483550,
            }}>
            <Icon handleClick={handleIconClick} />
          </div>
        </ClickAwayListener>
      )}
    </>
  );
};

createRoot(shadowRootElement).render(
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme} colorSchemeNode={shadowRootElement}>
      <App />
    </ThemeProvider>
  </CacheProvider>,
);
