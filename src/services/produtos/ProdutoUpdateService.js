import AppError from "../../utils/AppError.js";

export default class ProdutoUpdateService{
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id, nome, descricao, categoria, tamanho, estoque_atual } ){
    const produto = await this.#repository.show({ id });

    if(!produto){
        throw new AppError("O Produto especificado não existe.", 404);
    }

    produto.nome = nome ?? produto.nome;
    produto.descricao = descricao ?? produto.descricao;
    produto.categoria = categoria ?? produto.categoria;  
    produto.tamanho = tamanho ?? produto.tamanho;     
    produto.estoque_atual = estoque_atual ?? produto.estoque_atual; 

    const updated = await this.#repository.update({id, produto});

    return updated;
  }
}