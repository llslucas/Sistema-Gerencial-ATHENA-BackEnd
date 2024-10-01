export default class ProdutoSearchService{
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ search }){
    const searchValue = search ?? '';  
    const produtos = await this.#repository.search({ search: searchValue });
    return produtos;
  }
}