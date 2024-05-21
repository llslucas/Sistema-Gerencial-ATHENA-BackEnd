export class Produtos{
    constructor(produtos = []){
        this._produtos = [...produtos];        
    }   

    renew(produtos = []){
        this._produtos = [...produtos];
    }

    paraArray(){   
        return [].concat(this._produtos);
    } 

    esvazia(){
        this._produtos.length = 0;
    }
}