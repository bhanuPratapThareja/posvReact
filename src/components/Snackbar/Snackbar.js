import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

export default function PositionedSnackbar(props) {
  const [state, setState] = React.useState({
    open: true,
    vertical: 'top',
    horizontal: 'right',
  });

  const { vertical, horizontal, open } = state;


  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{props.messageInfo}</span>}
      />
    </div>
  );
}