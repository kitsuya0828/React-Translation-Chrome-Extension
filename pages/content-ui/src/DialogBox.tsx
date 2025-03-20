// prettier-ignore
import { Avatar, Box, ClickAwayListener, Divider, FormControl, IconButton, MenuItem, Select, Stack, Tooltip, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Clear, ContentCopyOutlined, VolumeUp, Settings } from '@mui/icons-material';
import { useState } from 'react';

export interface DialogBoxProps {
  translatedText: string;
  originalText: string;
  targetLang: string;
}

export const DialogBox = (props: DialogBoxProps) => {
  const [opened, setOpened] = useState(true);
  const [lang, setLang] = useState(props.targetLang);
  const IconUrl = chrome.runtime.getURL('icon-128.png');

  const handleClickAway = () => {
    setOpened(false);
  };

  const handleChange = (event: SelectChangeEvent<typeof lang>) => {
    setLang(event.target.value);
  };

  return opened ? (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        sx={{ p: 2, width: 450, backgroundColor: 'white', borderRadius: 2, boxShadow: '0px 0px 10px rgba(0,0,0,.3)' }}>
        <Stack direction="row" justifyContent="space-between" pb={1}>
          <Stack direction="row" alignItems="center" spacing={0}>
            <Avatar src={IconUrl} />
            <Typography variant="body1" color="textPrimary" sx={{ fontWeight: 'bold' }}>
              オリジナル翻訳
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="end" spacing={0}>
            <FormControl size="small">
              <Select value={lang} onChange={handleChange} MenuProps={{ disablePortal: true }} displayEmpty>
                <MenuItem value="EN">英語</MenuItem>
                <MenuItem value="KO">韓国語</MenuItem>
                <MenuItem value="ZH">中国語</MenuItem>
                <MenuItem value="JA">日本語</MenuItem>
              </Select>
            </FormControl>
            <IconButton size="small" sx={{ ml: 1 }}>
              <Settings />
            </IconButton>
            <IconButton size="small" onClick={handleClickAway}>
              <Clear />
            </IconButton>
          </Stack>
        </Stack>
        <Divider />
        <Stack pt={1} spacing={1} textAlign="left">
          <Typography variant="body2" color="textPrimary">
            {props.translatedText}
          </Typography>
          <Stack direction="row" justifyContent="flex-end" spacing={1} pr={2}>
            <Tooltip title="音声読み上げ" placement="top" arrow>
              <IconButton>
                <VolumeUp />
              </IconButton>
            </Tooltip>
            <Tooltip title="クリップボードにコピー" placement="top" arrow>
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(props.translatedText);
                }}>
                <ContentCopyOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>
    </ClickAwayListener>
  ) : null;
};
