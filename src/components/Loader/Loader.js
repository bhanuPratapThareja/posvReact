import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Loader.css';

export default function Loader() {

  return (
    <div className="custom_loader">
        <CircularProgress />
    </div>
  );
}