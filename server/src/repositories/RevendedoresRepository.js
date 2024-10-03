import knex from "../database/knex/index.js";

export default class RevendedoresRepository{
  async disconnect(){
    knex.destroy();
  }

  async create({ nome, contato, comissao }){   
    const [ revendedorId ] = await knex("revendedores").insert({
      nome,
      contato,
      comissao
  });

    return revendedorId;
  }

  async show({ id }){
    const revendedor = await knex("revendedores").where({ id }).first();
    return revendedor;
  }

  async search({ search }){
    const revendedores = await knex("revendedores")
            .whereLike("nome", `%${search}%`)            
            .orderBy("nome");

    return revendedores;
  }

  async delete({ id }){
    const deleted = await knex("revendedores").where({ id }).delete();
    return deleted;
  }

  async update({ id, revendedor }){
    const updated = await knex("revendedores").where({ id }).update(revendedor);       
    await knex("revendedores").where({ id }).update({created_at: knex.fn.now()}); 
    return updated;
  }

  async deleteAll(){
    if(process.env.NODE_ENV === "test"){
       await knex("revendedores").delete();
    }else{
      throw Error("Essa função só pode ser executada em ambiente de testes.");
    }
  };
}