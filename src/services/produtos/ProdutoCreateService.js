import AppError from "../../utils/AppError.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
export default class ProdutoCreateService{
  /** @type ProdutosRepository */
  #repository;

  constructor(repository){    
    this.#repository = repository;
  }

  async execute({ nome, descricao, categoria, tamanho, estoque_atual }){

    if(!nome || !descricao || !categoria || !tamanho || !estoque_atual ){
      throw new AppError("Todas as informações necessárias devem ser informadas.");
    }    

    const produto_id = await this.#repository.create({ nome, descricao, categoria, tamanho, estoque_atual });

    return produto_id;
  }

}