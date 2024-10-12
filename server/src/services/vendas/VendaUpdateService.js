import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import VendasRepository from "../../repositories/VendasRepository.js";
import AppError from "../../utils/AppError.js";

export default class VendaUpdateService{
  /** @type VendasRepository */
  #repository

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id, tipo_pagamento, data_venda, id_revendedor, id_cliente, itens }){
    const venda = await this.#repository.show({ id });   

    if(!venda){
      throw new AppError("A venda especificada não existe.", 404);
    }

    if(!tipo_pagamento && !data_venda && !id_revendedor && !id_cliente && !itens){
      throw new AppError("Pelo menos um campo a ser alterado deve ser informado.");
    }

    const newVenda = {};    
    
    newVenda.tipo_pagamento = tipo_pagamento ?? venda.tipo_pagamento;
    newVenda.data_venda = data_venda ?? venda.data_venda;
    newVenda.id_revendedor = id_revendedor ?? venda.revendedor.id;  
    newVenda.id_cliente = id_cliente ?? venda.cliente.id;   

    await this.#repository.update({
      id, 
      tipo_pagamento: newVenda.tipo_pagamento, 
      data_venda: newVenda.data_venda, 
      id_revendedor: newVenda.id_revendedor, 
      id_cliente: newVenda.id_cliente,
      itens 
    });
  }
}