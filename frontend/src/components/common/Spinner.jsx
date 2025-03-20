import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 'medium' }) => {
  return (
    <div className={`spinner spinner-${size}`}>
      <div className="spinner-circle"></div>
    </div>
  );
};

export default Spinner; 