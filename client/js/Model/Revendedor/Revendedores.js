export class Revendedores{
    constructor(revendedores = []){
        this._revendedores = [...revendedores];
        Object.freeze(this);
    }   

    add(revendedor){
        this._revendedores.push(revendedor);
    }

    paraArray(){   
        return [].concat(this._revendedores);
    } 

    esvazia(){
        this._revendedores.length = 0;
    }
}