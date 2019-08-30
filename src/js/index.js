import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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
        recipeView.renderRecipe(
            state.recipe,
            state.likes.isLiked(id));
            
        }
        catch(error){
            
            alert('Error processing recipe!');
        }
        
    }
};

//window.addEventListener('hashchange',controlRecipe);
//window.addEventListener('load',controlRecipe);
['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe));

//list controller
const controlList=()=>{
    //create a new list if there is none yet
    if(!state.list){
        state.list=new List();
    }
    //Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el=>{
        const item= state.list.addItem(el.count,el.unit,el.ingredient);
        listView.renderItem(item);
    });

};


//Handle delete and update list item events

elements.shopping.addEventListener('click',e=>{
    const id=e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete button

    if(e.target.matches('.shopping__delete,.shopping__delete *')){
        //delete from state
         state.list.deleteItem(id);
        // delete from UI
        listView.deleteItem(id);
        //handle the count update
    }else if(e.target.matches('.shopping__count-value')){
        const val=parseFloat(e.target.value,10);
        state.list.updateCount(id,val);
    }

});

//Like controller
//Testing
state.likes=new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());
const controlLike=()=>{
    if(!state.likes) state.likes=new Likes();
    const currentID=state.recipe.id;
    //user has not like the current recipe
    
    if(!state.likes.isLiked(currentID)){
        const newLike=state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //add like to the state
        likesView.renderLike(newLike);
        //toggle the like button
        likesView.toggleLikeBtn(true);

        //add like to UI list

    }else{
        //user has liked the current recipe
        //remove like to the state
        state.likes.deleteLike(currentID);
        
        //toggle the like button
        likesView.toggleLikeBtn(false);
        //remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());

};

//restore liked recipes on page load
window.addEventListener('load',()=>{
    state.likes=new Likes();
    //restore likes
    state.likes.readStorage();
    //toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //render existing likes
    state.likes.likes.forEach(like=>likesView.renderLike(like));

});



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
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //add ingredients to shopping list

        controlList();
    }
    else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //add the recipe to loved recipes
        
        controlLike();

    }
    
        
        
});

const l=new List();
window.l=l;

