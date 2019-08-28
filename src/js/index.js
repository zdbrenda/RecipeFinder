import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements,renderLoader,clearLoader} from './views/base';
//global state of the app
// -search object

const state={};
const controlSearch =async ()=>{
    // 1. get query from view
    
    const query = searchView.getInput(); //todo
    if(query){
        
        //2. new search object and add it to state
        state.search = new Search(query);
        
        //3. prepare UI
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        //4. search the recipes
        await state.search.getResults();
        
        //5. render results on UI
        clearLoader();
        searchView.renderResults(state.search.results);
        
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



