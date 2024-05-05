export class Revendedor{
    constructor(id, nome, contato, comissao, created_at, updated_at){
        this._id = id;
        this._nome = nome;
        this._contato = contato;
        this._comissao = comissao;
        this._created_at = created_at;
        this._updated_at = updated_at;
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
}