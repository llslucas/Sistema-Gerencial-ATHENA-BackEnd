import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class ComprasController{
    async create(request,response){
        const { numero_nota, fornecedor, data_compra, itens } = request.body;  
        
        const notaExiste = await knex("compras").where({numero_nota}).first();
        
        if(notaExiste){
            throw new AppError("Já existe uma nota com este número cadastrada.", 404);
        }else if(!itens || !itens.length){
            throw new AppError("Não é possível cadastrar uma compra sem itens.", 400);
        }else{

            const [id_compra] = await knex("compras").insert({
                numero_nota,
                fornecedor,
                data_compra
            });            

            console.log(id_compra);

            for (const item of itens) {
                await knex("itens_da_compra").insert({
                    id_produto: item.id_produto,
                    id_compra,
                    quantidade: item.quantidade,
                    valor_unitario: item.valor_unitario,
                    valor_total: item.valor_total
                })
            }   
            response.status(201).json("Compra cadastrada com sucesso: " + id_compra);
        }        
    }
    

    async show(request, response){
        const { id } = request.params;

        const compra = await knex("compras").where({ id }).first();  

        if(compra){  
            const produtos = await knex("itens_da_compra")
                .select([
                    "produtos.id",
                    "produtos.nome",
                    "produtos.descricao",
                    "produtos.categoria",
                    "produtos.tamanho",
                    "produtos.estoque_atual",
                    "itens_da_compra.quantidade",
                    "itens_da_compra.valor_unitario",
                    "itens_da_compra.valor_total"
                ])
                .innerJoin("produtos", "produtos.id", "itens_da_compra.id_produto")
                .where("itens_da_compra.id_compra", compra.id)
                .orderBy("produtos.categoria")
                .orderBy("produtos.nome")         

            return response.json({
                id: compra.id,
                fornecedor: compra.fornecedor,  
                data_compra: compra.data_compra,              
                produtos
            });
        }else{
            throw new AppError("A compra especificada não existe.", 404);
        };
    }

    async delete(request, response){
        const { id } = request.params;

        const deleted = await knex("compras").where({ id }).delete();

        if(deleted){
            return response.json();
        }else{
            throw new AppError("A compra especificada não existe.", 404);
        }
    }

    async index(request, response){    
        const compras = await knex("compras");        

        const compras_id = compras.map(compra => compra.id);

        const produtos = await knex("itens_da_compra")
            .select([
                "produtos.id",
                "produtos.nome",
                "produtos.descricao",
                "produtos.categoria",
                "produtos.tamanho",
                "produtos.estoque_atual",
                "itens_da_compra.quantidade",
                "itens_da_compra.valor_unitario",
                "itens_da_compra.valor_total",
                "itens_da_compra.id_compra"
            ])
            .innerJoin("produtos", "produtos.id", "itens_da_compra.id_produto")
            .whereIn("itens_da_compra.id_compra", compras_id)
            .orderBy("produtos.categoria")
            .orderBy("produtos.nome") 
        
        const insertCompras = compras.map(compra => {            
            const produtosCompra = produtos.filter(produto => produto.id_compra == compra.id);

            return {
                id: compra.id,
                fornecedor: compra.fornecedor,  
                data_compra: compra.data_compra,              
                produtosCompra            
            }
        });

        return response.json(insertCompras);                       
    }

    async update(request, response){
        const { id } = request.params;
        const { numero_nota, fornecedor, data_compra, itens } = request.body; 

        const compra = await knex("compras").where({id}).first();    
           
        if(!compra){
            throw new AppError("A Compra especificada não existe.", 404);
        }        

        compra.numero_nota = numero_nota ?? compra.numero_nota;
        compra.fornecedor = fornecedor ?? compra.fornecedor;
        compra.data_compra = data_compra ?? compra.data_compra;        

        await knex("compras").update(compra).where({ id });

        if(itens && itens.length){
            console.log(itens);
            await knex("itens_da_compra").where({id_compra: compra.id}).delete();

            for (const item of itens) {
                await knex("itens_da_compra").insert({
                    id_produto: item.id_produto,
                    id_compra: compra.id,
                    quantidade: item.quantidade,
                    valor_unitario: item.valor_unitario,
                    valor_total: item.valor_total
                })
            }
        }

        await knex("compras").update({updated_at: knex.fn.now()}).where({ id });

        return response.json("Compra alterada com sucesso!");  
    }  
}