export class Revendedores{
    constructor(revendedores = []){
        this._revendedores = [...revendedores];        
    }   

    renew(revendedores = []){
        this._revendedores = [...revendedores];
    }

    paraArray(){   
        return [].concat(this._revendedores);
    } 

    esvazia(){
        this._revendedores.length = 0;
    }
}