export class Cliente{   
    constructor(obj){
        this._id = obj.id;
        this._nome = obj.nome;
        this._telefone = obj.telefone;
        this._email = obj.email;
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

    info(){
        return {nome: this.nome, telefone: this.telefone, email: this.email};
    }
}