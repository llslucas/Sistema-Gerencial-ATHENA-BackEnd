import ComprasRepository from "../../repositories/ComprasRepository.js";
import AppError from "../../utils/AppError.js";

export default class CompraShowService{
  /** @type ComprasRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id }){
    const compra = await this.#repository.show({ id });

    if(!compra){
      throw new AppError("A Compra especificada não existe.", 404);
    }

    return compra;
  }
}