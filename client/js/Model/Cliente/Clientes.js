export class Clientes{
    constructor(clientes = []){
        this._clientes = [...clientes];
        Object.freeze(this);
    }   

    add(cliente){
        this._clientes.push(cliente);
    }

    paraArray(){   
        return [].concat(this._clientes);
    } 

    esvazia(){
        this._clientes.length = 0;
    }
}