import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements} from './views/base';
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
        
        //4. search the recipes
        await state.search.getResults();
        
        //5. render results on UI
        searchView.renderResults(state.search.results);
        
    }
};
elements.searchForm.addEventListener('submit', e=>{
    
    e.preventDefault();
    controlSearch();
    
});



