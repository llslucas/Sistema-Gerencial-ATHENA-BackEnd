import PanosRepository from "../../repositories/PanosRepository.js";

export default class PanoSearchService{
  /** @type PanosRepository */
  #repository; 

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ search }){
    const searchValue = search ?? "";

    const panos = await this.#repository.search({ search: searchValue });
    
    return panos;
  }
}