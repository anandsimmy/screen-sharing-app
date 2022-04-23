import React, { useState } from 'react';
import './CodeComponent.css';

const CodeComponent = () => {
  // const { showJoin, setShowJoin } = useState(false);

  return (
    <div className='wrapper'>
      <div className='title'>SHARE YOUR SCREEN</div>
      <button className='button join'>Join Sharing</button>
      <button className='button share'>Start Sharing</button>
    </div>
  );
};

export default CodeComponent;
