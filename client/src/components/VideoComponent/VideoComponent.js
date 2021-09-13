import React from 'react'
import styles from './VideoComponent.module.css'
 
const VideoComponent= () => {
    return (
      <>
        <video
          id='my-video'
          className={styles.myVideo}
          controls
          autoPlay
        />
        <video
          id='user-video'
          className={styles.userVideo}
          controls
          autoPlay
        />
        <div className={styles.buttonContainer}>
          <button id="start">Start</button>
          <button id="switch">Switch</button>
        </div>
      </>
    )
}

export default VideoComponent