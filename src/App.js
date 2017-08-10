import React, { Component } from 'react'
import {AppBar, FlatButton, Font} from 'material-ui'
import './App.css';
import MealCalendar from './components/MealCalendar/'

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppBar title="Meal Planner" iconElementRight={<FlatButton label="Shopping Cart"/>}/>
        <MealCalendar />
      </div>
    );
  }
}

export default App;
