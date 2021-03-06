import Search from './models/Search'
import Recipe from  './models/Recipe'
import List from  './models/List'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import { elements, renderLoader, clearLoader } from './views/base'

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
  */
 
const state = {}

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1) Get the query from view
    const query = searchView.getInput()

    if(query) {
        // 2) New search object and add to state
        state.search = new Search(query)

        // the search query will now live in the state object

        // 3) Prepare UI for results
        searchView.clearInput()
        searchView.clearResults()
        renderLoader(elements.searchRes)

        try {
            // 4) Search for recipes
            await state.search.getResults()

            // 5) render results on UI
            clearLoader()
            searchView.renderResults(state.search.result)
        } catch(err) {
            alert('Something is wrong with the search...')
            clearLoader()
        }

    }
}


 // EVENT LISTENERS
 document.addEventListener('keypress', e => {
    if (e.keyCode === 13 || e.which ===13) {
        elements.searchInput.focus()
    }
})

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault()
    controlSearch()
})

// TESTING
window.addEventListener('load', e => {
    e.preventDefault()
    controlSearch()
})

elements.searchRes.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10)
        searchView.clearResults()
        searchView.renderResults(state.search.result, goToPage)
    }
})



/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '')
    console.log(id)

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe()
        renderLoader(elements.recipe)

        // Highlight selected search item
        if (state.search)searchView.highlightSelected(id)

        // Create new recipe object
        state.recipe = new Recipe(id)

        // try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe()
            state.recipe.parseIngredients()
            // console.log(state.recipe.ingredients)

            // Calculate servings and time
            state.recipe.calcTime()
            state.recipe.calcServings()

            //Render recipe
            clearLoader()
            recipeView.renderRecipe(state.recipe)
        // } catch (err) {
        //     alert('Error procsessing recipe!')
        // }
    }
}

// adding the same event listener to different events
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec')
            recipeView.updateServingsIngredients(state.recipe)
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe)
    }
    console.log(state.recipe.servings)
        
})

window.l = new List()