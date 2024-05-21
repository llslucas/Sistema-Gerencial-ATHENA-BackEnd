export class Clientes{
    constructor(clientes = []){
        this._clientes = [...clientes];        
    }   

    renew(clientes = []){
        this._clientes = [...clientes];
    }

    paraArray(){   
        return [].concat(this._clientes);
    } 

    esvazia(){
        this._clientes.length = 0;
    }
}