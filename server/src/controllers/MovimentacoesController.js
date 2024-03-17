import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class MovimentacoesController{
    async create(request,response){
        const { motivo, data_movimentacao, itens } = request.body;                 
        
        if(!itens || !itens.length){
            throw new AppError("Não é possível cadastrar uma movimentação sem itens.", 400);
        }else{

            const [id_movimentacao] = await knex("movimentacoes").insert({                
                motivo,
                data_movimentacao
            });               

            for (const item of itens) {
                await knex("itens_da_movimentacao").insert({
                    id_produto: item.id_produto,
                    id_movimentacao,
                    tipo_movimentacao: item.tipo_movimentacao,
                    quantidade: item.quantidade,
                    valor_unitario: item.valor_unitario,
                    valor_total: item.valor_total
                })
            }   
            response.status(201).json("Movimentação cadastrada com sucesso: " + id_movimentacao);
        }        
    }
    

    async show(request, response){
        const { id } = request.params;

        const movimentacao = await knex("movimentacoes").where({ id }).first();  

        if(movimentacao){  
            const produtos = await knex("itens_da_movimentacao")
                .select([
                    "produtos.id",
                    "produtos.nome",
                    "produtos.descricao",
                    "produtos.categoria",
                    "produtos.tamanho",
                    "produtos.estoque_atual",
                    "itens_da_movimentacao.tipo_movimentacao",
                    "itens_da_movimentacao.quantidade",
                    "itens_da_movimentacao.valor_unitario",
                    "itens_da_movimentacao.valor_total"
                ])
                .innerJoin("produtos", "produtos.id", "itens_da_movimentacao.id_produto")
                .where("itens_da_movimentacao.id_movimentacao", movimentacao.id)
                .orderBy("produtos.categoria")
                .orderBy("produtos.nome")         

            return response.json({
                id: movimentacao.id,
                motivo: movimentacao.motivo,  
                data_movimentacao: movimentacao.data_movimentacao,              
                produtos
            });
        }else{
            throw new AppError("A Movimentação especificada não existe.", 404);
        };
    }

    async delete(request, response){
        const { id } = request.params;

        const deleted = await knex("movimentacoes").where({ id }).delete();

        if(deleted){
            return response.json();
        }else{
            throw new AppError("A Movimentação especificada não existe.", 404);
        }
    }

    async index(request, response){    
        const movimentacoes = await knex("movimentacoes");        

        const movimentacoes_id = movimentacoes.map(movimentacao => movimentacao.id);

        const produtos = await knex("itens_da_movimentacao")
            .select([
                "produtos.id",
                "produtos.nome",
                "produtos.descricao",
                "produtos.categoria",
                "produtos.tamanho",
                "produtos.estoque_atual",
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
                motivo: movimentacao.motivo,  
                data_movimentacao: movimentacao.data_movimentacao,              
                produtosMovimentacao            
            }
        });

        return response.json(insertMovimentacoes);                       
    }

    async update(request, response){
        const { id } = request.params;
        const { motivo, data_movimentacao, itens } = request.body;  

        const movimentacao = await knex("movimentacoes").where({id}).first();    
           
        if(!movimentacao){
            throw new AppError("A Movimentação especificada não existe.", 404);
        }  
        
        movimentacao.motivo = motivo ?? movimentacao.motivo;
        movimentacao.data_movimentacao = data_movimentacao ?? movimentacao.data_movimentacao;        

        await knex("movimentacoes").update(movimentacao).where({ id });

        if(itens && itens.length){            
            await knex("itens_da_movimentacao").where({id_movimentacao: movimentacao.id}).delete();

            for (const item of itens) {
                await knex("itens_da_movimentacao").insert({
                    id_produto: item.id_produto,
                    id_movimentacao: movimentacao.id,
                    tipo_movimentacao: item.tipo_movimentacao,
                    quantidade: item.quantidade,
                    valor_unitario: item.valor_unitario,
                    valor_total: item.valor_total
                })
            }
        }

        await knex("movimentacoes").update({updated_at: knex.fn.now()}).where({ id });

        return response.json("Movimentação alterada com sucesso!");  
    }  
}