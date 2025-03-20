import { createRoot } from 'react-dom/client';
import { DialogBox } from '@src/DialogBox';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';

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
  return (
    <div style={{ position: 'absolute', width: '100%', left: '0px', top: '0px', zIndex: 2147483550 }}>
      <div style={{ position: 'absolute', left: '10px', top: '10px', zIndex: 2147483550 }}>
        <DialogBox
          translatedText="ここに翻訳したテキストが入る"
          originalText="ここに翻訳前のテキストが入る"
          targetLang="JA"
        />
      </div>
    </div>
  );
};

createRoot(shadowRootElement).render(
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme} colorSchemeNode={shadowRootElement}>
      <App />
    </ThemeProvider>
  </CacheProvider>,
);
