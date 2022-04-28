import React, { useState } from 'react';
import './CodeComponent.css';

const CodeComponent = () => {
  const [showJoin, setShowJoin] = useState(false);

  return (
    <div className='wrapper'>
      <div className='title'>SHARE YOUR SCREEN</div>
      {showJoin ? (
        <>
          <label className='joinLabel'>Enter Room Code</label>
          <input className='joinInput' />
          <div className='buttonContainer'>
            <button className='button'>Join</button>
            <button className='button back' onClick={() => setShowJoin(false)}>
              Back
            </button>
          </div>
        </>
      ) : (
        <>
          <button className='button join' onClick={() => setShowJoin(true)}>
            Join Sharing
          </button>
          {/* <button className='button share'>Start Sharing</button> */}
        </>
      )}
    </div>
  );
};

export default CodeComponent;
