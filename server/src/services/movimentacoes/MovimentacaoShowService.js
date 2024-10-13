import MovimentacoesRepository from "../../repositories/MovimentacoesRepository.js";

export default class MovimentacaoShowService{
  /** @type MovimentacoesRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;    
  }

  async execute({ id }){
    const movimentacao = await this.#repository.show({ id });    
    return movimentacao;
  }
}