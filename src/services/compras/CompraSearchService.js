import ComprasRepository from "../../repositories/ComprasRepository.js";
import AppError from "../../utils/AppError.js";

export default class CompraSearchService{
  /** @type ComprasRepository */
  #repository

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ search }) {
    const searchValue = search ?? '';

    const compras = await this.#repository.search({ search: searchValue }); 
    
    return compras;    
  }
}