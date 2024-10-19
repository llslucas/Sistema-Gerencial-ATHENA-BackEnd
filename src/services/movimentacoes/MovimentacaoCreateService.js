import MovimentacoesRepository from "../../repositories/MovimentacoesRepository.js";
import AppError from "../../utils/AppError.js";

export default class MovimentacaoCreateService{
  /** @type MovimentacoesRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;    
  };

  async execute({ descricao, data_movimentacao, itens }){
    if(!descricao || !data_movimentacao){
      throw new AppError("Todos os campos de cadastro devem estar preenchidos.");
    };

    if(!itens || !itens.length){
      throw new AppError("A Movimentação deve conter ao menos um item.");
    };

    const movimentacao_id = await this.#repository.create({ descricao, data_movimentacao, itens });

    return movimentacao_id;
  }
}