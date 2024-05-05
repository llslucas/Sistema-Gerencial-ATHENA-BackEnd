export class Cliente{
    constructor(id, nome, telefone, email, created_at, updated_at){
        this._id = id;
        this._nome = nome;
        this._telefone = telefone;
        this._email = email;
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

    get telefone(){
        return this._telefone;
    }

    get email(){
        return this._email;
    }

    get created_at(){
        return this._created_at;
    }

    get updated_at(){
        return this._updated_at;
    }
}