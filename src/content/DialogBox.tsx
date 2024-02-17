import {
  ActionIcon,
  Avatar,
  Box,
  CopyButton,
  Divider,
  Flex,
  Group,
  Select,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useState } from 'react';
import { MdDone, MdOutlineContentCopy, MdVolumeUp } from 'react-icons/md';

export interface DialogBoxProps {
  translatedText: string;
  originalText: string;
  targetLang: string;
}

import { translate } from '../app/translate';
import { getBucket } from '@extend-chrome/storage';

interface MyBucket {
  targetLang: string;
}

const bucket = getBucket<MyBucket>('my_bucket', 'sync');

export const DialogBox = (props: DialogBoxProps) => {
  const [opened, setOpened] = useState(true);
  const [diaglog, setDialog] = useState<HTMLDivElement | null>(null);
  const [text, setText] = useState(props.translatedText);
  const [lang, setLang] = useState(props.targetLang);

  useClickOutside(() => setOpened(false), null, [diaglog]);
  const IconUrl = chrome.runtime.getURL('images/extension_128.png');

  const handleChange = async (value: string) => {
    bucket.set({ targetLang: value });
    const newText = await translate(props.originalText, value);
    setText(newText);
    setLang(value);
  };

  return opened ? (
    <Box
      sx={(theme) => ({
        textAlign: 'left',
        padding: theme.spacing.md,
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: theme.radius.md,
        boxShadow: '0px 0px 10px rgba(0,0,0,.3)',
        zIndex: 2147483550,
      })}
      component="div"
      ref={setDialog}
    >
      <Flex pb="xs" gap="xs" justify="flex-start" align="center">
        <Avatar src={IconUrl} />
        <Text size="md" c="dark">
          訳文：
        </Text>
        <Select
          value={lang}
          onChange={(value: string) => handleChange(value)}
          size="xs"
          data={[
            { value: 'EN', label: '英語' },
            { value: 'KO', label: '韓国語' },
            { value: 'ZH', label: '中国語' },
            { value: 'JA', label: '日本語' },
          ]}
        />
      </Flex>
      <Divider />
      <Stack pt="sm" spacing="xs" style={{ textAlign: 'left' }}>
        <Text size="sm" c="dark">
          {text}
        </Text>
        <Group position="right" spacing="xs">
          <Tooltip label="音声読み上げ" withArrow>
            <ActionIcon>
              <MdVolumeUp />
            </ActionIcon>
          </Tooltip>
          <CopyButton value={text}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? '訳文をコピーしました' : 'クリップボードにコピー'} withArrow>
                <ActionIcon onClick={copy}>
                  {copied ? <MdDone /> : <MdOutlineContentCopy />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Stack>
    </Box>
  ) : (
    <></>
  );
};
