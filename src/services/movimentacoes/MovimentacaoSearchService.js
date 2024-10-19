import MovimentacoesRepository from "../../repositories/MovimentacoesRepository.js";

export default class MovimentacaoSearchService{
  /** @type MovimentacoesRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;    
  }

  async execute({ search }){
    const searchValue = search ?? "";

    const movimentacoes = await this.#repository.search({ search: searchValue });
    
    return movimentacoes;
  }
}