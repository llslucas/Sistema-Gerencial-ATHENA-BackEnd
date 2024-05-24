export class Produto{
    constructor(obj){
        this._id = obj.id;
        this._nome = obj.nome;
        this._descricao = obj.descricao;
        this._categoria = obj.categoria;
        this._tamanho = obj.tamanho;
        this._estoqueAtual = obj.estoque_atual;
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