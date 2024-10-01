import knex from "../database/knex/index.js";

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