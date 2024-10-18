import knex from "../database/knex/index.js";
import MovimentacoesRepository from "./MovimentacoesRepository.js";

export default class ProdutosRepository{
  async disconnect(){
    knex.destroy();
  }

  async create({ nome, descricao, categoria, tamanho, estoque_atual }){   
    const [ produto_id ] = await knex("produtos").insert({
      nome,
      descricao,
      categoria,
      tamanho,
      estoque_atual
    });

    // Cria a movimentação de Saldo Inicial.
    const movimentacoesRepository = new MovimentacoesRepository();

    await movimentacoesRepository.create({
      descricao: "Saldo Inicial",
      data_movimentacao: knex.fn.now(),
      itens: [{
        id: produto_id,
        tipo_movimentacao: "ENTRADA",
        quantidade: estoque_atual,
        valor_unitario: 0,
        valor_total: 0
      }]
    });

    return produto_id;
  }

  async show({ id }){
    const produto = await knex("produtos").where({ id }).first();
    return produto;
  }

  async search({ search }){
    const produtos = await knex("produtos")
            .whereLike("produtos.nome", `%${search}%`)    
            .orWhereLike("produtos.descricao", `%${search}%`)     
            .orWhereLike("produtos.categoria", `%${search}%`)             
            .orderBy("nome");

    return produtos;
  }

  async delete({ id }){
    const deleted = await knex("produtos").where({ id }).delete();
    return deleted;
  }

  async update({ id, produto }){
    const updated = await knex("produtos").update(produto).where({ id });
    await knex("produtos").update({updated_at: knex.fn.now()}).where({ id });

    return updated;
  }

  async deleteAll(){
    if(process.env.NODE_ENV === "test"){
       await knex("produtos").delete();
    }else{
      throw Error("Essa função só pode ser executada em ambiente de testes.");
    }
  };
}