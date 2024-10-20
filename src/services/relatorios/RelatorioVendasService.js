import VendasRepository from "../../repositories/VendasRepository.js";
import RelatorioExcel from "../../Excel/RelatorioExcel.js";
import { wbStyles } from "../../Excel/wbStyles.js";
import AppError from "../../utils/AppError.js";

export default class RelatorioVendasService{
  /** @type VendasRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ startDate, endDate }){
    if(!startDate || !endDate){
      throw new AppError("Os campos startDate e endDate são necessários.");
    }

    const vendas = await this.#repository.getByDate({startDate, endDate});    

    if(!vendas || vendas.length === 0){
      throw new AppError("A pesquisa não retornou resultados.", 404);
    }

    const vendasArray = vendas.map(venda => {      
      return [
        venda.data_venda, 
        venda.tipo_pagamento, 
        venda.cliente, 
        venda.revendedor, 
        venda.valor_total
      ]
    });   

    const relatorio = new RelatorioExcel();

    relatorio.addTabela({
      headers: ["Data da Venda", "Tipo do Pagamento", "Cliente", "Revendedor", "Valor da venda"],
      values: vendasArray
    });

    relatorio.setFormat({
      column: 5,
      format: wbStyles.format.contabil
    });

    relatorio.setColumnsWidth([20, 20, 20, 20, 20]);    

    return relatorio;
  }
}