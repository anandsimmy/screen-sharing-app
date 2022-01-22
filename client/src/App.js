import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CodeComponent from './components/CodeComponent/CodeComponent';
import VideoComponent from './components/VideoComponent/VideoComponent';
import styles from './App.module.css';

const App = () => {
  return (
    <div className={styles.container}>
      <Router>
        <Switch>
          <Route exact path='/' component={CodeComponent} />
          <Route path='/video' component={VideoComponent} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
