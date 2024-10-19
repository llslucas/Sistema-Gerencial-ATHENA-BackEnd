import VendasRepository from "../../repositories/VendasRepository.js";
import AppError from "../../utils/AppError.js";

export default class VendaSearchService{
  /** @type VendasRepository */
  #repository

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ search }) {
    const searchValue = search ?? '';

    const vendas = await this.#repository.search({ search: searchValue }); 
    
    return vendas;    
  }
}