export class TableView{
    constructor(seletor){
        this._elemento = document.querySelector(seletor);
    }

    update(model){
        this._elemento.innerHTML = this.template(model);
    }

    template(model){
        throw new Error('Implemente o método template');
    }
}