import VendasRepository from "../../repositories/VendasRepository.js";
import AppError from "../../utils/AppError.js";

export default class VendaDeleteService{
  /** @type VendasRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id }){
    const venda = await this.#repository.show({ id });

    const deleted = await this.#repository.delete({ id });

    if(!deleted){
      throw new AppError("A venda especificada não existe.", 404);
    }

    return venda;
  }
}