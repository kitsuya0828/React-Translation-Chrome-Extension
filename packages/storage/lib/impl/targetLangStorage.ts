import { createStorage, StorageEnum } from '../base/index.js';

export const targetLangStorage = createStorage<string>('target-lang-storage-key', 'JA', {
  storageEnum: StorageEnum.Sync,
});
