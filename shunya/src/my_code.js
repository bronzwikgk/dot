class MyEntity{
    constructor(){

    }
    init(){
        //load default files, and data
        // initCache
    }
         //create [id=method_ActionEntity_create] [role="Persists new records."] [desc="gets schema from cache as per entty id or name in payload, Validates payload agsinst schema, and writes to persistant storage using this.persist."]

    create(){}
        //    - read [id=method_ActionEntity_read] [role="Fetches records."] [desc="Loads stored data, applies filters, and returns formatted responses."]

    get(){}
          //  - update [id=method_ActionEntity_update] [role="Updates existing records."] [desc="Validates deltas, merges changes, and re-saves data with RBAC guards."]

    update(){}
        //- delete [id=method_ActionEntity_delete] [role="Removes records."] [desc="Checks permissions and deletes data from storage adapters."]

    delete(){}
    persist(){

    }
   //  - formatResponse [id=method_ActionEntity_formatResponse] [role="Shapes API outputs."] [desc="Includes status/data/errors aligned with AppConfig schema."]
     //   - buildTree [id=method_ActionEntity_buildTree] [role="Constructs tree data."] [desc="Transforms entity lists into hierarchical structures for UI/viewers."]
    // - traverse [id=method_ActionEntity_traverse] [role="Walks tree nodes."] [desc="Visits each tree entry to run validators or compute summaries."]
        //- flatten [id=method_ActionEntity_flatten] [role="Produces flat lists from trees."] [desc="Supports search/query operations that need linear datasets."]
   
       
}
class Mycode{
    constructor(input){
        this.runtime = detectRuntime();
        this.config = input.[this.runtime]
        this.start();
    }
    detectRuntime(){
        // detetcs run time and returns. options [ node, browser,GAS]
    }
    start(a,b){
        return a+b;
    }
    load(a,b){
        return a-b;
    }
    init(a,b){
        return a*b;
    }
    initPlugins(){

    }
    resolve(){

    }
    handleRequest(){

    }
    sendResponse(){
        
    }
}

const mycodeConfig = {

}
const demo =myCode(mycodeConfig)