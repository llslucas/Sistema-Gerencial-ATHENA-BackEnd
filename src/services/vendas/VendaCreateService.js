import VendasRepository from "../../repositories/VendasRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import AppError from "../../utils/AppError.js";

export default class VendaCreateService{
  /**@type VendasRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ tipo_pagamento, data_venda, id_revendedor, id_cliente, itens }){ 
    
    if(!tipo_pagamento || !data_venda || !id_revendedor || !id_cliente){
      throw new AppError("Todas as informações necessárias devem ser informadas.", 400);
    }
    
    if(!itens || !itens.length){
      throw new AppError("Não é possível cadastrar uma venda sem itens.", 400);
    }   

    const id_venda = await this.#repository.create({ tipo_pagamento, data_venda, id_revendedor, id_cliente, itens });

    return id_venda;
  }
}