import MovimentacoesRepository from "../../repositories/MovimentacoesRepository.js";
import AppError from "../../utils/AppError.js";

export default class MovimentacaoDeleteService{
  /** @type MovimentacoesRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;    
  }

  async execute({ id }){
    const deleted = await this.#repository.delete({ id });

    if(!deleted){
      throw new AppError("A Movimentação especificada não existe.", 404);
    }

    return deleted;
  }
}