export class Revendedor{
    constructor(obj){
        this._id = obj.id;
        this._nome = obj.nome;
        this._contato = obj.contato;
        this._comissao = obj.comissao;
        this._created_at = obj.created_at;
        this._updated_at = obj.updated_at;
        Object.freeze(this);
    }

    get id(){
        return this._id;
    }

    get nome(){
        return this._nome;
    }

    get contato(){
        return this._contato;
    }

    get comissao(){
        return this._comissao;
    }

    get created_at(){
        return this._created_at;
    }

    get updated_at(){
        return this._updated_at;
    }

    info(){
        return {nome: this.nome, contato: this.contato, comissao: this.comissao}
    }
}