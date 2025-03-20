import { createStorage, StorageEnum } from '../base/index.js';

export const showIconStorage = createStorage<boolean>('show-icon-storage-key', true, {
  storageEnum: StorageEnum.Sync,
  liveUpdate: true, // *1
});
