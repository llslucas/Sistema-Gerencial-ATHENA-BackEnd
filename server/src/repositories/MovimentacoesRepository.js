import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class MovimentacoesRepository{
  async disconnect(){
    knex.destroy();
  };

  async create({ descricao, data_movimentacao, itens }){
    //Verificação dos itens
    if(itens){
      for(const item of itens){      
        if(!await knex("produtos").where({ id: item.id }).first()){
          throw new AppError(`O Produto com o ID: ${ item.id } não existe.`, 404);
        }
      }
    };

    const [id_movimentacao] = await knex("movimentacoes").insert({                
      descricao,
      data_movimentacao
    });               

    for (const item of itens) {
      await knex("itens_da_movimentacao").insert({
        id_produto: item.id,
        id_movimentacao,
        tipo_movimentacao: item.tipo_movimentacao,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
        valor_total: item.valor_total
      });
    };

    return id_movimentacao;
  };

  async show({ id }){
    const movimentacao = await knex("movimentacoes").where({ id }).first();

    if(!movimentacao){
      throw new AppError("A Movimentação especificada não existe.", 404);
    }

    const produtos = await knex("itens_da_movimentacao")
                              .select([
                                  "produtos.id",
                                  "produtos.nome",
                                  "produtos.descricao",
                                  "produtos.categoria",
                                  "produtos.tamanho",                                  
                                  "itens_da_movimentacao.tipo_movimentacao",
                                  "itens_da_movimentacao.quantidade",
                                  "itens_da_movimentacao.valor_unitario",
                                  "itens_da_movimentacao.valor_total"
                              ])
                              .innerJoin("produtos", "produtos.id", "itens_da_movimentacao.id_produto")
                              .where("itens_da_movimentacao.id_movimentacao", movimentacao.id)
                              .orderBy("produtos.categoria")
                              .orderBy("produtos.nome")

    return {
      id: movimentacao.id,
      descricao: movimentacao.descricao,  
      data_movimentacao: movimentacao.data_movimentacao,              
      itens: produtos
    };
  };

  async delete({ id }){
    const deleted = await knex("movimentacoes").where({ id }).delete();
    return deleted;        
  };

  async search({ search }){
    const movimentacoes = await knex("movimentacoes");  

    const movimentacoes_id = movimentacoes.map(movimentacao => movimentacao.id);

    const produtos = await knex("itens_da_movimentacao")
                              .select([
                                  "produtos.id",
                                  "produtos.nome",
                                  "produtos.descricao",
                                  "produtos.categoria",
                                  "produtos.tamanho",                          
                                  "itens_da_movimentacao.tipo_movimentacao",
                                  "itens_da_movimentacao.quantidade",
                                  "itens_da_movimentacao.valor_unitario",
                                  "itens_da_movimentacao.valor_total",
                                  "itens_da_movimentacao.id_movimentacao"
                              ])
                              .innerJoin("produtos", "produtos.id", "itens_da_movimentacao.id_produto")
                              .whereIn("itens_da_movimentacao.id_movimentacao", movimentacoes_id)
                              .orderBy("produtos.categoria")
                              .orderBy("produtos.nome") 
    
    const insertMovimentacoes = movimentacoes.map(movimentacao => {            
      const produtosMovimentacao = produtos.filter(produto => produto.id_movimentacao == movimentacao.id);

      return {
        id: movimentacao.id,
        descricao: movimentacao.descricao,  
        data_movimentacao: movimentacao.data_movimentacao,              
        itens: produtosMovimentacao            
      }
    });

    const filteredMovimentacoes = insertMovimentacoes.filter(mov => {
      return mov.id == search ||
             mov.descricao.includes(search) ||
             mov.itens.find(item => item.nome.includes(search))
    })

    return filteredMovimentacoes;
  };

  async update({ id, descricao, data_movimentacao, itens }){  
    //Verificação dos itens
    if(itens){
      for(const item of itens){      
        if(!await knex("produtos").where({ id: item.id }).first()){
          throw new AppError(`O Produto com o ID: ${ item.id } não existe.`, 404);
        }
      }
    };

    await knex("movimentacoes").update(
      { descricao, data_movimentacao, updated_at: knex.fn.now() }
    ).where({ id });

    if(itens && itens.length){            
      await knex("itens_da_movimentacao").where({id_movimentacao: id}).delete();

      for (const item of itens) {
        await knex("itens_da_movimentacao").insert({
          id_produto: item.id,
          id_movimentacao: id,
          tipo_movimentacao: item.tipo_movimentacao,
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total
        });
      };
    };
  };

  async deleteAll(){
    if(process.env.NODE_ENV === "test"){
       await knex("movimentacoes").delete();
    }else{
      throw Error("Essa função só pode ser executada em ambiente de testes.");
    }
  };  
}