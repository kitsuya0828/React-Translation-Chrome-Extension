import { withErrorBoundary, withSuspense } from '@extension/shared';
import { Stack, Switch, Typography } from '@mui/material';
import { useState } from 'react';

const Popup = () => {
  const [checked, setChecked] = useState(false);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.currentTarget.checked);
  };

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" p={1}>
      <Typography variant="body1">拡張機能のアイコンを表示</Typography>
      <Switch checked={checked} onChange={handleToggle} color="success" />
    </Stack>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
