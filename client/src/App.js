import React, { useState } from 'react';
import logo from './logo.svg';
import UserContext from './userContext';
import './App.css';
import Camera from './components/Camera';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Home from './screens/Home';
import Kanban from './screens/Kanban';
import Stats from './screens/Stats';

function App() {
  const [productive, setProductive] = useState(0);
  const [slack, setSlack] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [overBreak, setOverBreak] = useState(0);
  const [onBreak, setOnBreak] = useState(false);
  const [badPostureTime, setBadPostureTime] = useState(0);
  const [goodPostureTime, setGoodPostureTime] = useState(0);

  return (
    <Router>
      <UserContext.Provider value={{
        productive: productive,
        setProductive: setProductive,
        slack: slack,
        setSlack: setSlack,
        breakTime: breakTime,
        setBreak: setBreakTime,
        overBreak: overBreak,
        setOverBreak: setOverBreak,
        onBreak: onBreak,
        setOnBreak: setOnBreak,
        badPostureTime: badPostureTime,
        setBadPostureTime: setBadPostureTime,
        goodPostureTime: goodPostureTime,
        setGoodPostureTime: setGoodPostureTime
      }}>
        <div className="App">
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
