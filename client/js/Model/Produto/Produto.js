export class Produto{
    constructor(nome, descricao, categoria, tamanho, estoque_atual, created_at = null, updated_at = null, id = null){
        this._id = id;
        this._nome = nome;
        this._descricao = descricao;
        this._categoria = categoria;
        this._tamanho = tamanho;
        this._estoqueAtual = estoque_atual;
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

    get descricao(){
        return this._descricao;
    }

    get categoria(){
        return this._categoria;
    }

    get tamanho(){
        return this._tamanho;
    }

    get estoque_atual(){
        return this._estoqueAtual;
    }

    info(){
        return {nome: this._nome, descricao: this._descricao, categoria: this._categoria, tamanho: this._tamanho, estoque_atual: this._estoqueAtual}
    }
    
}