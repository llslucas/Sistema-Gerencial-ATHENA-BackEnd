export class Produtos{
    constructor(produtos = []){
        this._produtos = [...produtos];
        Object.freeze(this);
    }   

    add(produto){
        this._produtos.push(produto);
    }

    paraArray(){   
        return [].concat(this._produtos);
    } 

    esvazia(){
        this._produtos.length = 0;
    }
}