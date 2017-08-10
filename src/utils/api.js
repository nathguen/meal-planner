const API_ID = process.env.REACT_APP_API_ID
const APP_KEY = process.env.REACT_APP_APP_KEY

export function fetchRecipes(food) {
    return fetch(`https://api.edamam.com/search?q=${food}&app_id=${API_ID}&app_key=${APP_KEY}`)
        .then((resp) => resp.json())
        .then((resp) => {
            return resp.hits.reduce((arr, item) => {
                arr.push(item.recipe)
                return arr
            }, [])
        })
}