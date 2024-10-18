import ComprasRepository from "../../repositories/ComprasRepository.js";
import AppError from "../../utils/AppError.js";

export default class CompraDeleteService{
  /** @type ComprasRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id }){
    const compra = await this.#repository.show({ id });

    const deleted = await this.#repository.delete({ id });

    if(!deleted){
      throw new AppError("A compra especificada não existe.", 404);
    }

    return compra;
  }
}