import MovimentacoesRepository from "../../repositories/MovimentacoesRepository.js";
import AppError from "../../utils/AppError.js";

export default class MovimentacaoUpdateService{
  /** @type MovimentacoesRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;    
  }

  async execute({ id, descricao, data_movimentacao, itens }){
    const movimentacao = await this.#repository.show({ id });

    if(!movimentacao){
      throw new AppError("A Movimentação especificada não existe.", 404);
    }

    if(!descricao && !data_movimentacao && !itens){
      throw new AppError("Pelo menos um campo a ser alterado deve ser informado.");
    }

    const newMovimentacao = {};

    newMovimentacao.descricao = descricao ?? movimentacao.descricao;
    newMovimentacao.data_movimentacao = data_movimentacao ?? movimentacao.data_movimentacao;

    await this.#repository.update({
      id,
      descricao: descricao ?? movimentacao.descricao,
      data_movimentacao: data_movimentacao ?? movimentacao.data_movimentacao,
      itens
    });    
  }
}