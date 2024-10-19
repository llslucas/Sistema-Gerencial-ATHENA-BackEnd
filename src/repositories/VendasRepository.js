import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class VendasRepository{
  async disconnect(){
    knex.destroy();
  }

  async create({ tipo_pagamento, data_venda, id_revendedor, id_cliente, itens }){        
    //Verificação do Revendedor
    const revendedor = await knex("revendedores").where({id: id_revendedor}).first();
    if(!revendedor){
      throw new AppError("Revendedor inválido.", 404);
    }
    
    //Verificação do cliente
    const cliente = await knex("clientes").where({id: id_cliente}).first();  
    if(!cliente){
      throw new AppError("Cliente inválido.", 404);
    }

    //Verificação dos itens
    //Verificação dos itens
    if(itens){
      for(const item of itens){      
        const produto = await knex("produtos").where({ id: item.id }).first();        

        if(!produto){
          throw new AppError(`O Produto com o ID: ${item.id} não existe.`, 404);
        }

        if(produto.estoque_atual < item.quantidade){
          throw new AppError(`Não há saldo sufuciente do produto ${produto.nome} para realizar a venda. \n Saldo atual: ${produto.estoque_atual} \n Saldo Necessário: ${item.quantidade}`);
        }       
      }
    }

    const [id_venda] = await knex("vendas").insert({                
        tipo_pagamento,
        data_venda,
        id_revendedor,
        id_cliente
    });               

    for (const item of itens) {
        await knex("itens_da_venda").insert({
            id_produto: item.id,
            id_venda,                    
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario,
            valor_total: item.valor_total,
            valor_comissao: item.valor_comissao
        })
    }   

    return id_venda;
  }

  async show({ id }){
    const venda = await knex("vendas").where({ id }).first(); 

    if(!venda){
      return null;
    }
    
    const produtos = await knex("itens_da_venda")
        .select([
            "produtos.id",
            "produtos.nome",
            "produtos.descricao",
            "produtos.categoria",
            "produtos.tamanho",                               
            "itens_da_venda.quantidade",
            "itens_da_venda.valor_unitario",
            "itens_da_venda.valor_total",
            "itens_da_Venda.valor_comissao"
        ])
        .innerJoin("produtos", "produtos.id", "itens_da_venda.id_produto")
        .where("itens_da_venda.id_venda", venda.id)
        .orderBy("produtos.categoria")
        .orderBy("produtos.nome")   
        
    const revendedor = await knex("revendedores").where({id: venda.id_revendedor}).first();
    const cliente = await knex("clientes").where({id: venda.id_cliente}).first();

    return {
        id: venda.id,                
        data_venda: venda.data_venda,   
        tipo_pagamento: venda.tipo_pagamento, 
        cliente,
        revendedor,          
        itens: produtos
    };   
  }

  async delete({ id }){
    //Os itens da venda são excluídos automaticamente pelo banco de dados graças ao CASCADE.
    const deleted = await knex("vendas").where({ id }).delete();
    return deleted;
  }

  async search({ search }){
    const vendas = await knex("vendas");        
    const vendas_id = vendas.map(venda => venda.id);
    const revendedores_id = vendas.map(venda => venda.id_revendedor);
    const clientes_id = vendas.map(venda => venda.id_cliente);

    const produtos = await knex("itens_da_venda")
        .select([                
            "produtos.id",
            "produtos.nome",
            "produtos.descricao",
            "produtos.categoria",
            "produtos.tamanho",                               
            "itens_da_venda.quantidade",
            "itens_da_venda.valor_unitario",
            "itens_da_venda.valor_total",
            "itens_da_Venda.valor_comissao",                
            "itens_da_venda.id_venda"
        ])
        .innerJoin("produtos", "produtos.id", "itens_da_venda.id_produto")
        .whereIn("itens_da_venda.id_venda", vendas_id)
        .orderBy("produtos.categoria")
        .orderBy("produtos.nome") 

    const revendedores = await knex("revendedores").whereIn("id", revendedores_id );
    const clientes = await knex("clientes").whereIn("id", clientes_id);
    
    const insertVendas = vendas.map(venda => {   
        const produtosVenda = produtos.filter(produto => produto.id_venda == venda.id);
        produtosVenda.forEach(produto => delete produto.id_venda)         
        const [revendedor] = revendedores.filter(revendedor => revendedor.id == venda.id_revendedor);
        const [cliente] = clientes.filter(cliente => cliente.id == venda.id_cliente);       

        return {
            id: venda.id,                
            data_venda: venda.data_venda,   
            tipo_pagamento: venda.tipo_pagamento, 
            cliente,
            revendedor,        
            itens: produtosVenda
        }
    });    

    const filteredVendas = insertVendas.filter(venda => {    
      return String(venda.id).includes(search) ||
      venda.cliente.nome.includes(search) ||
      venda.revendedor.nome.includes(search) ||
      venda.tipo_pagamento.includes(search) ||
      venda.data_venda.includes(search) ||
      venda.itens.find(produto => produto.nome.includes(search))
    });  

    return filteredVendas;
  }

  async update({ id, tipo_pagamento, data_venda, id_revendedor, id_cliente, itens }){   
    //Verificação do Revendedor
    const revendedor = await knex("revendedores").where({id: id_revendedor}).first();
    if(!revendedor){
      throw new AppError("Revendedor inválido.", 404);
    }
    
    //Verificação do cliente
    const cliente = await knex("clientes").where({ id: id_cliente }).first();  
    if(!cliente){
      throw new AppError("Cliente inválido.", 404);
    }

    //Verificação dos itens
    if(itens){
      for(const item of itens){      
        const produto = await knex("produtos").where({ id: item.id }).first();  
  
        if(!produto){
          throw new AppError(`O Produto com o ID: ${item.id} não existe.`, 404);
        }

        const item_venda = await knex("itens_da_venda").where({id_produto: item.id, id_venda: id}).first();        
        
        const quantidade = item_venda ? item_venda.quantidade : 0;   

        if(produto.estoque_atual < item.quantidade - quantidade){
          throw new AppError(`Não há saldo sufuciente do produto ${produto.nome} para alterar a venda. \n Saldo atual: ${produto.estoque_atual} \n Saldo Necessário: ${item.quantidade - quantidade}.`);
        }       
      }
    }    

    await knex("vendas").update({ tipo_pagamento, data_venda, id_revendedor, id_cliente, updated_at: knex.fn.now() }).where({ id }); 

    if(itens && itens.length){            
      await knex("itens_da_venda").where({ id_venda: id }).delete();

      for (const item of itens) {
        await knex("itens_da_venda").insert({
          id_produto: item.id,
          id_venda: id,                    
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total,
          valor_comissao: item.valor_comissao
        })
      }
    }
  }

  async checkIfExists({ id }){
    const venda = await knex("vendas").where({ id }).first();

    return Boolean(venda);
  }

  async deleteAll(){
    if(process.env.NODE_ENV === "test"){
       await knex("vendas").delete();
    }else{
      throw Error("Essa função só pode ser executada em ambiente de testes.");
    }
  };
}