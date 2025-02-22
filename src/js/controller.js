import * as model from './model.js';
import { CLOSE_MODAL_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import homeView from './views/homeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Show loading spinner
    recipeView.renderSpinner();

    // Update results view to mark selected recipe
    resultsView.update(model.getSearchResultsPage());

    // Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    // Show loading spinner
    resultsView.renderSpinner();

    // Clear recipe view so unrelated recipe is not being displayed
    recipeView.resetRecipeView();

    // Get search query or use query in state for updating search results after deleting a recipe
    const query = searchView.getQuery() || model.state.search.query;
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchResultsPage());

    // Render results count
    resultsView.renderResultsCount(model.state.search.results.length);

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlHome = function () {
  window.history.replaceState(null, '', '/');
  location.reload();
};

const controlPagination = function (goToPage) {
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.update(model.state.recipe);
  // recipeView.render(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render new recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, CLOSE_MODAL_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
  setTimeout(function () {
    location.reload();
  }, 1500);
};

const controlDeleteRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render loading spinner
    recipeView.renderSpinner();

    // Delete the recipe
    await model.deleteRecipe(id);

    // Update results view
    resultsView.render(model.getSearchResultsPage());

    // Update pagination
    paginationView.render(model.state.search);

    // Update bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Show successful deletion message
    recipeView.renderMessage('Recipe was successfully deleted.');

    // Clear recipe view after delay
    setTimeout(function () {
      recipeView.renderMessage('Search for another recipe or ingredient!');
      window.history.pushState(null, '', '/');

      // Update search results
      controlSearchResults();
    }, 1500);
  } catch (err) {
    console.error('Error in controlDeleteRecipe:', err);
    recipeView.renderError('You do not have permission to delete this recipe.');
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerDeleteRecipe(controlDeleteRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  homeView.addHandlerHome(controlHome);

  window.history.replaceState(null, '', '/');
};
init();
