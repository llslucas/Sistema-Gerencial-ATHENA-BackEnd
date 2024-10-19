import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class PanosRepository{
  async disconnect(){
    knex.destroy();
  }

  async create({ id_revendedor, observacoes, itens }){    
    const revendedor = await knex("revendedores").where({id: id_revendedor}).first();    

    if(!revendedor){
      throw new AppError(`O Revendedor id ${ id_revendedor } não existe.`);
    }

    const [pano_id] = await knex("panos").insert({
      id_revendedor,
      observacoes
    });
    
    for (const item of itens) {
      await knex("itens_do_pano").insert({
        id_produto: item.id_produto,
        id_pano: pano_id,
        quantidade: item.quantidade,
        valor_venda: item.valor_venda
      });
    };

    return pano_id;
  };

  async show({ id }){
    const pano = await knex("panos").where({ id }).first();

    if(!pano){
      throw new AppError("O Pano especificado não existe.", 404);
    }
         
    const revendedor = await knex("revendedores")
                              .select([
                                "revendedores.id",
                                "revendedores.nome",
                                "revendedores.contato",
                                "revendedores.comissao"
                              ])
                              .where({id: pano.id_revendedor}).first();            

    const produtos = await knex("itens_do_pano")
                              .select([
                                "produtos.id",
                                "produtos.nome",
                                "produtos.descricao",
                                "produtos.categoria",
                                "produtos.tamanho",                                  
                                "itens_do_pano.quantidade",
                                "itens_do_pano.valor_venda"
                              ])
                              .innerJoin("produtos", "produtos.id", "itens_do_pano.id_produto")
                              .where("itens_do_pano.id_pano", pano.id)
                              .orderBy("produtos.categoria")
                              .orderBy("produtos.nome");
      
    return {
      id: pano.id,
      observacoes: pano.observacoes,
      revendedor,
      itens: produtos
    };
    
  };

  async search({ search }){
    const panos = await knex("panos");
    
    const revendedores = await knex("revendedores")
                                .select([
                                    "revendedores.id",
                                    "revendedores.nome",
                                    "revendedores.contato",
                                    "revendedores.comissao"
                                ]);

    const panos_id = panos.map(pano => pano.id);

    const produtos = await knex("itens_do_pano")
                                .select([
                                    "produtos.id",
                                    "produtos.nome",
                                    "produtos.descricao",
                                    "produtos.categoria",
                                    "produtos.tamanho",                                    
                                    "itens_do_pano.quantidade",
                                    "itens_do_pano.valor_venda",
                                    "itens_do_pano.id_pano"
                                ])
                                .innerJoin("produtos", "produtos.id", "itens_do_pano.id_produto")
                                .whereIn("itens_do_pano.id_pano", panos_id)
                                .orderBy("produtos.categoria")
                                .orderBy("produtos.nome");
    
    const insertPanos = panos.map(pano => {
        const [ revendedor ] = revendedores.filter(revendedor => revendedor.id == pano.id_revendedor);
        const produtosPano = produtos.filter(produto => produto.id_pano == pano.id);
        produtosPano.forEach(produto => delete produto.id_pano);

        return {
            id: pano.id,
            observacoes: pano.observacoes,
            revendedor,
            itens: produtosPano                
        }
    });

    const filteredPanos = insertPanos.filter(pano => {
      return pano.id == search ||
             pano.observacoes.includes(search) ||
             pano.revendedor.nome.includes(search) || 
             pano.itens.filter(item => item.nome.includes(search)).length > 0
    });

    return filteredPanos;
  };

  async delete({ id }){
    const deleted = await knex("panos").where({ id }).delete();
    return deleted;
  };

  async update({ id, id_revendedor, observacoes, itens }){
    //Verificação do Revendedor
    const revendedor = await knex("revendedores").where({id: id_revendedor}).first();
    if(!revendedor){
      throw new AppError(`O Revendedor com ID: ${id_revendedor} não existe.`, 404);
    };

    //Verificação dos itens
    if(itens){
      for(const item of itens){      
        const produto = await knex("produtos").where({ id: item.id_produto }).first()       
        if(!produto){
          throw new AppError(`O Produto com o ID: ${item.id_produto} não existe.`, 404);
        }
      }
    };

    await knex("panos").update({ id_revendedor, observacoes }).where({ id });

    if(itens && itens.length){
      await knex("itens_do_pano").where({id_pano: id}).delete();

      for (const item of itens){
        await knex("itens_do_pano").insert({
          id_produto: item.id_produto,
          id_pano: id,
          quantidade: item.quantidade,
          valor_venda: item.valor_venda
        });
      };

    };

    await knex("panos").update({updated_at: knex.fn.now()}).where({ id });
  }

  async checkIfExists({ id }){
    const pano = await knex("panos").where({ id }).first();
    return Boolean(pano);
  }

  async deleteAll(){
    if(process.env.NODE_ENV === "test"){
       await knex("panos").delete();
    }else{
      throw Error("Essa função só pode ser executada em ambiente de testes.");
    }
  };
  
}