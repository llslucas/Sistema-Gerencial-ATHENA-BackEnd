export default class RevendedorSearchService{
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ search }){
    const searchValue = search ?? '';  
    const revendedores = await this.#repository.search({ search: searchValue });
    return revendedores;
  }
}