import VendasRepository from "../../repositories/VendasRepository.js";
import AppError from "../../utils/AppError.js";

export default class VendaShowService{
  /** @type VendasRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id }){
    const venda = await this.#repository.show({ id });

    if(!venda){
      throw new AppError("A Venda especificada não existe.", 404);
    }

    return venda;
  }
}