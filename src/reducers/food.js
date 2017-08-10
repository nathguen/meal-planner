import { ADD_RECIPE } from '../actions'

export default function reducer(state = {}, action) {
  const { recipe } = action
  switch(action.type) {
    case ADD_RECIPE:
      return {
        ...state,
        [recipe.label]: recipe
      }
    default:
      return state
  }
}
