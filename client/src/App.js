import React, { useEffect } from 'react'
import { startConnection } from './connection-utils/connection';
import CodeComponent from './components/CodeComponent/CodeComponent'
import VideoComponent from './components/VideoComponent/VideoComponent'
import styles from './App.module.css';
 
const App= () => {

  useEffect(()=> {
    startConnection();
  }, [])

  return (
    <div className={styles.container}>
        {/* <CodeComponent /> */}
        <VideoComponent />
    </div>
  );
}

export default App;
