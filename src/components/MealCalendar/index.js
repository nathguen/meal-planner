import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import FaCalendarPlusO from 'react-icons/lib/fa/calendar-plus-o'
import MdArrowForward from 'react-icons/lib/md/arrow-forward'
import MdAddCircle from 'react-icons/lib/md/add-circle'
import { Card, TextField, GridList, GridTile, Subheader, IconButton } from 'material-ui'
import Modal from 'react-modal'
import Loading from 'react-loading'
import { fetchRecipes } from '../../utils/api'
import { addRecipe, removeFromCalendar } from '../../actions'
import './styles.css'

class MealCalendar extends Component {
    state = {
        searchModalOpen: false,
        searchingFood: false,
        recipeResults: [],
        searchQuery: '',
        selectedDay: '',
        selectedMeal: ''
    }

    openSearchModal = (day, meal) => {
        this.setState({
            searchModalOpen: true,
            selectedDay: Object.keys(day),
            selectedMeal: meal
        })
    }

    closeSearchModal = (e) => {
        this.setState({searchModalOpen: false})
    }

    foodSearch = (e) => {
        const value = this.foodSearchInput.input.value
        this.setState({
            searchingFood: true,
            searchQuery: value
        })
        fetchRecipes(value).then((recipeResults) => {
            this.setState({
                searchingFood: false,
                recipeResults
            })
            // this.foodSearchInput.input.value = ''
        })
        // @TODO fetch recipes
    }

    selectRecipe = (recipe) => {
        const { selectedDay, selectedMeal } = this.state
        this.props.dispatch(addRecipe({
            recipe,
            day: selectedDay,
            meal: selectedMeal
        }))
        this.closeSearchModal()
    }

    render() {
        const mealTypes = ['breakfast', 'lunch', 'dinner']
        const {calendar, food} = this.props
        const {searchModalOpen, searchingFood, recipeResults, searchQuery} = this.state
        return (
            <div className="meal-calendar">
                <ul className="calendar-days">
                    {calendar.map(day => <li key={Object.keys(day)}>{_.capitalize(Object.keys(day))}</li>)}
                </ul>
                <div className="calendar-grid">
                    <ul className="meal-types">
                        {mealTypes.map(meal => (
                            <li key={meal}><h4>{meal}</h4></li>
                        ))}
                    </ul>
                    <ul className="day-cols">
                        {calendar.map(day => (
                            <li key={Object.keys(day)} className="day-col">
                                <ul className="day-col">
                                    {mealTypes.map(meal => (
                                        <li key={meal} className="meal-item">
                                            {   day[Object.keys(day)][meal]
                                            ?   <Card className="meal-item-card">
                                                    <img 
                                                        src={food[day[Object.keys(day)][meal]].image} 
                                                        alt={day[Object.keys(day)][meal]} />
                                                    <div className="meal-item-label">
                                                        {day[Object.keys(day)][meal]}
                                                    </div>
                                                </Card>
                                            :   <Card className="meal-item-card add-meal-card" onClick={() => this.openSearchModal(day, meal)}>
                                                    <FaCalendarPlusO 
                                                        className="add-meal-button" 
                                                        size={30}/>
                                                </Card>}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>

                <Modal 
                    isOpen={searchModalOpen} 
                    overlayClassName="calendar-overlay" 
                    className="calendar-modal"
                    contentLabel="Search Recipes"
                    onRequestClose={this.closeSearchModal}>
                   { searchingFood === true
                    ? <Loading delay={200} type='spin' color='#222' className='recipe-searching' />
                    :  <form onSubmit={(e) => {
                            e.preventDefault()
                            this.foodSearch()
                        }}>
                            <div className="recipe-search">
                                <h2>Recipe Search</h2>
                                <TextField hintText="Search for recipe" autoFocus ref={(ref) => this.foodSearchInput = ref}/>
                                <MdArrowForward onClick={this.foodSearch}/>
                            </div>
                            { (recipeResults.length > 0) && (
                                <div className="search-results">
                                    <GridList
                                        cols={4}
                                        cellHeight={180}>
                                        <Subheader>Results for "{searchQuery}"</Subheader>
                                        {recipeResults.map((recipe) => (
                                            <GridTile
                                                className="recipe-result-tile"
                                                key={recipe.image}
                                                title={recipe.label}
                                                titleBackground="rgba(0,0,0,.4)"
                                                onClick={() => this.selectRecipe(recipe)}
                                                subtitle={<span>by <b>{recipe.source}</b></span>}
                                                actionIcon={<MdAddCircle 
                                                                className="recipe-tile-action" 
                                                                color="white" 
                                                                size={30} />}>
                                                <img src={recipe.image} />
                                            </GridTile>
                                        ))}
                                    </GridList>
                                </div>
                            ) }
                        </form> }
                </Modal>
            </div>
        )
    }
}

function mapPropsToState({calendar, food}) {
    return {
        calendar: Object.keys(calendar).map((day) => {
            return {
                [day]: calendar[day]
            }
        }),
        food
    }
}

export default connect(mapPropsToState)(MealCalendar)