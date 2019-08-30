import axios from 'axios';

export const key ='9f5c36682a9d0e24a60f8a4a9fe8e0bc';
      
 //key1='9f5c36682a9d0e24a60f8a4a9fe8e0bc';
//key2='943d77d4d4c18ef5bad9f6e5ae17a4f3';
//key3='7ab713b5ab1f110034335f89c9c40902';
//key4='1aa819c89e79a6afa151268a76666298';
export default class Search{
    
    constructor(query){
        
        this.query=query;
    }
    
    async getResults(){
        const key='9f5c36682a9d0e24a60f8a4a9fe8e0bc';
        try{
            
            const result=await axios(`https://www.food2fork.com/api/search
?key=${key}&q=${this.query}`);
            //console.log(result);
            this.results=result.data.recipes;
            //console.log(this.results);
        }
        catch(error){
            alert(error);
        }
    }
}