export default class ClienteSearchService{
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ search }){
    const searchValue = search ?? '';  
    const clientes = await this.#repository.search({ search: searchValue });
    return clientes;
  }
}