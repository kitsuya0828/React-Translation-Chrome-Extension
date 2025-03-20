import { Avatar, IconButton, Tooltip } from '@mui/material';

export interface IconProps {
  handleClick: () => void;
}

export const Icon = (props: IconProps) => {
  return (
    <Tooltip title="選択したテキストを翻訳" placement="top" arrow>
      <IconButton onClick={props.handleClick} size="small">
        <Avatar src={chrome.runtime.getURL('icon-34.png')} sx={{ width: 24, height: 24, bgcolor: 'white' }} />
      </IconButton>
    </Tooltip>
  );
};
