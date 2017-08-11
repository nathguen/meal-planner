import React, { Component } from 'react'
import {AppBar, FlatButton, Font, Toggle} from 'material-ui'
import './App.css';
import MealCalendar from './components/MealCalendar/'
import Modal from 'react-modal'
import { connect } from 'react-redux'

class App extends Component {
  state = {
    shoppingModalOpen: false
  }

  openShoppingModal = () => {
    this.setState({shoppingModalOpen: true})
  }

  closeShoppingModal = () => {
    this.setState({shoppingModalOpen: false})
  }

  render() {
    const { shoppingModalOpen } = this.state
    const { shoppingList } = this.props

    function renderShoppingList() {
      return (
        <div>
          <ul>
            { shoppingList.map(recipe => (
              <li key={recipe.image}>
                <h3>{recipe.label}</h3>
                <ul>
                  {recipe.ingredientLines.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )
    }

    return (
      <div className="App">
        <AppBar 
          title="Meal Planner" 
          iconElementRight={
            <FlatButton label="Shopping List" onClick={this.openShoppingModal}/>
          }/>
        <MealCalendar />
        <Modal 
            isOpen={shoppingModalOpen} 
            overlayClassName="calendar-overlay" 
            className="calendar-modal"
            contentLabel="Shopping Cart"
            onRequestClose={this.closeShoppingModal}>
            <h2>Shopping List</h2>
            { shoppingList.length
            ? renderShoppingList()
            : <p>No shopping list... try adding a meal to the calendar first.</p>}
        </Modal>
      </div>
    );
  }
}

function mapPropsToState({calendar, food}) {
  // compiles all planned meals into a single list
  return {
    shoppingList: Object.keys(calendar).reduce((arr, day) => {
      const foodArr = Object.keys(calendar[day]).reduce((arr, meal) => {
        if(calendar[day][meal]) {
          arr.push(food[calendar[day][meal]])
        }
        return arr
      }, [])
      arr = arr.concat(foodArr)
      return arr
    }, [])
  }
}

export default connect(mapPropsToState)(App)
