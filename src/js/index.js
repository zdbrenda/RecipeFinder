import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {elements,renderLoader,clearLoader} from './views/base';

//global state of the app
// -search object

const state={};

//Search controller
const controlSearch =async ()=>{
    // 1. get query from view
    
    const query = searchView.getInput(); 
    //const query='pizza';
    if(query){
        
        //2. new search object and add it to state
        state.search = new Search(query);
        
        //3. prepare UI
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        try{
             //4. search the recipes
        await state.search.getResults();
        
        //5. render results on UI
        clearLoader();
        searchView.renderResults(state.search.results);
            
        }catch(error){
            
            alert('Something wrong with the search ...');
            clearLoader();
        }
       
        
    }
};
elements.searchForm.addEventListener('submit', e=>{
    
    e.preventDefault();
    controlSearch();
    
});


elements.searchResPages.addEventListener('click',e=>{
    const btn=e.target.closest('.btn-inline');
    if(btn){
       const goToPage=parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.results,goToPage);
   }
});

//

/***
**** Recipe Controller
****
***/

const controlRecipe= async ()=>{
    const id=window.location.hash.replace("#","");
    //console.log(id);
    
    if(id){
        
        //1. prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        
        //highlight selected search item
        if(state.search){
           searchView.highlightSelected(id); 
        }
        
        
        //2. create new recipe object 
        state.recipe= new Recipe(id);
        //testing
        window.r=state.recipe;
        try{
            
            //3. get recipe data and parse ingredients
            
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        //4. calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();
        //5. render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe);
            
        }
        catch(error){
            alert('Error processing recipe!');
        }
        
    }
};

//window.addEventListener('hashchange',controlRecipe);
//window.addEventListener('load',controlRecipe);
['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe));

//Handling recipe button clicks
elements.recipe.addEventListener('click',e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings>1){
           //decrease button is clicked
        state.recipe.updateServings('dec'); 
        recipeView.updateServingsIngredients(state.recipe);
        }
        
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    console.log(state.recipe);
        
        
});
