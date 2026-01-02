class Mycode{
    constructor(input){
        this.runtime = detectRuntime();
        this.config = input.[this.runtime]
    }
    detectRuntime(){

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