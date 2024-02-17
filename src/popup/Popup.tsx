import { getBucket } from '@extend-chrome/storage';
import { Container, Select } from '@mantine/core';
import { useEffect, useState } from 'react';

interface MyBucket {
  targetLang: string | null;
}

const bucket = getBucket<MyBucket>('my_bucket', 'sync');

const Popup = () => {
  document.body.style.width = '20rem';
  document.body.style.height = '20rem';

  const [lang, setLang] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const value = await bucket.get();
      if (value.targetLang) {
        setLang(value.targetLang);
      }
    })();
  }, []);

  const saveLang = (lang: string | null) => {
    bucket.set({ targetLang: lang });
    setLang(lang);
  };

  return (
    <Container p="xl">
      <Select
        label="選択したテキストを次の言語に翻訳"
        value={lang}
        onChange={saveLang}
        data={[
          { value: 'EN', label: '英語' },
          { value: 'KO', label: '韓国語' },
          { value: 'ZH', label: '中国語' },
          { value: 'JA', label: '日本語' },
        ]}
        clearable
      />
    </Container>
  );
};

export default Popup;
