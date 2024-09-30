import knex from "../database/knex/index.js";

export default class ClientesRepository{
  async disconnect(){
    knex.destroy();
  }

  async create({nome, telefone, email}){   
    const [cliente_id] = await knex("clientes").insert({
        nome,
        telefone,
        email
    });

    return cliente_id;
  }

  async show({ id }){
    const cliente = await knex("clientes").where({ id }).first();
    return cliente;
  }

  async search({ search }){
    const clientes = await knex("clientes")
      .whereLike("clientes.nome", `%${ search }%`)
      .orWhereLike("clientes.email", `%${ search }%`)
      .orderBy("nome");

    return clientes;
  }

  async delete({ id }){
    const deleted = await knex("clientes").where({ id }).delete();
    return deleted;
  }

  async update({ id, cliente }){
    const updated = await knex("clientes").update(cliente).where({ id });
    await knex("clientes").update({updated_at: knex.fn.now()}).where({ id });
    return updated;
  }

  async deleteAll(){
    if(process.env.NODE_ENV === "test"){
       await knex("clientes").delete();
    }else{
      throw Error("Essa função só pode ser executada em ambiente de testes.");
    }
  };
}