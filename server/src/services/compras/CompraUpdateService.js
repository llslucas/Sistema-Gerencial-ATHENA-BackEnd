import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import ComprasRepository from "../../repositories/ComprasRepository.js";
import AppError from "../../utils/AppError.js";

export default class CompraUpdateService{
  /** @type ComprasRepository */
  #repository

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id, numero_nota, fornecedor, data_compra, itens }){
    const compra = await this.#repository.show({ id });   

    if(!compra){
      throw new AppError("A compra especificada não existe.", 404);
    }

    if(!numero_nota && !fornecedor && !data_compra && !itens){
      throw new AppError("Pelo menos um campo a ser alterado deve ser informado");
    }  

    await this.#repository.update({ 
      id, 
      numero_nota: numero_nota ?? compra.numero_nota,
      fornecedor: fornecedor ?? compra.fornecedor,
      data_compra: data_compra ?? compra.data_compra,
      itens 
    });
  }
}