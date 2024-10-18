import knex from "../database/knex/index.js";

export default class EstoqueRepository{
  async calcularSaldo( id_produto ){
    const movimentacoes = await knex("movimentacoes")
                                    .select([                                                                                                      
                                      "itens_da_movimentacao.tipo_movimentacao",
                                      "movimentacoes.data_movimentacao",
                                      "itens_da_movimentacao.quantidade"
                                    ])
                                    .innerJoin("itens_da_movimentacao", "itens_da_movimentacao.id_movimentacao", "movimentacoes.id")                                   
                                    .where("itens_da_movimentacao.id_produto", id_produto)
                                    .orderBy("itens_da_movimentacao.tipo_movimentacao")
                                    .orderBy("movimentacoes.data_movimentacao");
  
    const compras = await knex("itens_da_compra")
                            .select("quantidade")
                            .where({ id_produto });    

    const vendas = await knex("itens_da_venda")
                            .select("quantidade")
                            .where({ id_produto });                           

    const movEntradas = movimentacoes.filter(mov => mov.tipo_movimentacao === "ENTRADA").reduce((prev, curr) => prev + curr.quantidade, 0); 
    const movSaidas = movimentacoes.filter(mov => mov.tipo_movimentacao === "SAÍDA").reduce((prev, curr) => prev + curr.quantidade, 0);
    
    const saldoCompras = compras.reduce((prev, curr) => prev + curr.quantidade, 0);
    const saldoVendas = vendas.reduce((prev, curr) => prev + curr.quantidade, 0);

    const totalEntradas = (movEntradas + saldoCompras);
    const totalSaidas = (movSaidas + saldoVendas);    

    return totalEntradas - totalSaidas;
  }


}
