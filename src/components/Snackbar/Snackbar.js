import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

export default function PositionedSnackbar(props) {

  const [state, setState] = React.useState({
    open: true,
    vertical: 'top',
    horizontal: 'center',
  });

  const { vertical, horizontal, open } = state;


  const handleClose = () => {
    // props.closeSnackbar();
  };

  const getTextColor = () => {
    switch (props.snackbarMsgType){
      case 'error':
        return '#e3000c';
      case 'success':
        return '#00a73e';
      case 'warning':
        return '#ff9f00'
      default: 
        return '#e3000c';
    }
  } 

  const snackbarStyles = {
    fontWeight: '700',
    fontSize: '0.8rem',
    color: getTextColor()
  }

  return (
    <div className="snackbar">
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id" style={snackbarStyles}>{props.snackbarMsg}</span>}
      />
    </div>
  );
}