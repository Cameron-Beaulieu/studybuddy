import React, { useState } from 'react';
import UserContext from './userContext';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Head from './components/Head';
import Home from './screens/Home';
import Kanban from './screens/Kanban';
import Stats from './screens/Stats';

function App() {
  const [sessionTimeMinutes, setSessionTimeMinutes] = useState(0);
  const [productive, setProductive] = useState(0);
  const [slack, setSlack] = useState(0);
  const [breakMin, setBreakMin] = useState(0);
  const [workMin, setWorkMin] = useState(0);
  const [timeOnBreak, setTimeOnBreak] = useState(0);
  const [overBreak, setOverBreak] = useState(0);
  const [onBreak, setOnBreak] = useState(false);
  const [badPostureTime, setBadPostureTime] = useState(0);
  const [goodPostureTime, setGoodPostureTime] = useState(0);
  const [sips, setSips] = useState(0);

  return (
    <Router>
      <UserContext.Provider value={{
        sessionTime: sessionTimeMinutes, // minutes
        setSessionTime: setSessionTimeMinutes,
        productive: productive, // minutes
        setProductive: setProductive,
        slack: slack, // minutes
        setSlack: setSlack,
        breakMin: breakMin, // minutes
        setBreakMin: setBreakMin,
        workMin: workMin, // minutes
        setWorkMin: setWorkMin,
        timeOnBreak: timeOnBreak, // minutes
        setTimeOnBreak: setTimeOnBreak,
        overBreak: overBreak, // minutes
        setOverBreak: setOverBreak,
        onBreak: onBreak, // boolean
        setOnBreak: setOnBreak,
        badPostureTime: badPostureTime, // minutes
        setBadPostureTime: setBadPostureTime,
        goodPostureTime: goodPostureTime, // minutes
        setGoodPostureTime: setGoodPostureTime,
        sips: sips, // integer
        setSips: setSips
      }}>
        <div className="App">
          <Head/>
          <Switch>
            <Route path="/kanban">
              <Kanban></Kanban>
            </Route>
            <Route path="/stats">
              <Stats></Stats>
            </Route>
            <Route path="/">
              <Home></Home>
            </Route>
          </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
