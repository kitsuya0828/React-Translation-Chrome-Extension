import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
import { MantineProvider } from '@mantine/core';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Popup />
    </MantineProvider>
  </React.StrictMode>
);
