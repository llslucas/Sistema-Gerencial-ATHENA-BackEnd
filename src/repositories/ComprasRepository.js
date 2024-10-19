import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class ComprasRepository{
  async disconnect(){
    knex.destroy();
  }

  async create({ numero_nota, fornecedor, data_compra, itens }){
    //Verificação dos itens
    for(const item of itens){            
      if(!await knex("produtos").where({ id: item.id }).first()){
        throw new AppError(`O Produto com o ID: ${item.id} não existe.`, 404);
      }
    }

    const [id_compra] = await knex("compras").insert({
        numero_nota,
        fornecedor,
        data_compra
    });            

    for (const item of itens) {
        await knex("itens_da_compra").insert({
            id_produto: item.id,
            id_compra,
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario,
            valor_total: item.valor_total
        })
    }   

    return id_compra;
  }

  async show({ id }){
    const compra = await knex("compras").where({ id }).first();

    if(compra){
      const produtos = await knex("itens_da_compra")
          .select([
              "produtos.id",
              "produtos.nome",
              "produtos.descricao",
              "produtos.categoria",
              "produtos.tamanho",              
              "itens_da_compra.quantidade",
              "itens_da_compra.valor_unitario",
              "itens_da_compra.valor_total"
          ])
          .innerJoin("produtos", "produtos.id", "itens_da_compra.id_produto")
          .where("itens_da_compra.id_compra", compra.id)
          .orderBy("produtos.categoria")
          .orderBy("produtos.nome");     

      return {
          ...compra,        
          itens: produtos
      };
    }
  }

  async delete({ id }){
    //Os itens da compra são excluídos automaticamente pelo banco de dados graças ao CASCADE.
    const deleted = await knex("compras").where({ id }).delete();
    return deleted;
  }

  async search({ search }){
    const compras = await knex("compras");        

    const compras_id = compras.map(compra => compra.id); 

    const produtos = await knex("itens_da_compra")
        .select([
            "produtos.id",
            "produtos.nome",
            "produtos.descricao",
            "produtos.categoria",
            "produtos.tamanho",       
            "itens_da_compra.quantidade",
            "itens_da_compra.valor_unitario",
            "itens_da_compra.valor_total",
            "itens_da_compra.id_compra"
        ])
        .innerJoin("produtos", "produtos.id", "itens_da_compra.id_produto")
        .whereIn("itens_da_compra.id_compra", compras_id)
        .orderBy("produtos.categoria")
        .orderBy("produtos.nome");     
    
    const insertCompras = compras.map(compra => {            
        const produtosCompra = produtos.filter(produto => produto.id_compra == compra.id);

        return {
            ...compra,             
            itens: produtosCompra          
        }
    });

    const filteredCompras = insertCompras.filter(compra => {      
      return String(compra.numero_nota).includes(search) ||
      compra.fornecedor.includes(search) ||
      compra.itens.find(produto => produto.nome.includes(search))
    });

    return filteredCompras;
  }

  async update({ id, numero_nota, fornecedor, data_compra, itens }){   
    //Verificação dos itens
    if(itens){
      for(const item of itens){      
        if(!await knex("produtos").where({ id: item.id }).first()){
          throw new AppError(`O Produto com o ID: ${item.id} não existe.`, 404);
        }
      }
    }  

    await knex("compras").update({ numero_nota, fornecedor, data_compra, updated_at: knex.fn.now() }).where({ id });  

    if(itens && itens.length){
      await knex("itens_da_compra").where({id_compra: id}).delete();    

      for (const item of itens) {   
        await knex("itens_da_compra").insert({
            id_produto: item.id,
            id_compra: id,
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario,
            valor_total: item.valor_total
        });          
      }
    }    
  }

  async checkIfExists({ numero_nota }){
    const compra = await knex("compras").where({numero_nota}).first();
    return Boolean(compra);
  }

  async deleteAll(){
    if(process.env.NODE_ENV === "test"){
       await knex("compras").delete();
    }else{
      throw Error("Essa função só pode ser executada em ambiente de testes.");
    }
  };
}