import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class VendasController{
    async create(request,response){
        const { tipo_pagamento, data_venda, id_revendedor, id_cliente, itens } = request.body;   
        
        const revendedor = await knex("revendedores").where({ id: id_revendedor }).first(); 
        if(!revendedor){
            throw new AppError("O Revendedor especificado não existe.", 404);
        }

        const cliente = await knex("clientes").where({ id: id_cliente }).first();
        if(!cliente){
            throw new AppError("O Cliente especificado não existe.", 404);
        }        
        
        if(!itens || !itens.length){
            throw new AppError("Não é possível cadastrar uma venda sem produtos.", 400);
        }else{

            const [id_venda] = await knex("vendas").insert({                
                tipo_pagamento,
                data_venda,
                id_revendedor,
                id_cliente
            });               

            for (const item of itens) {
                await knex("itens_da_venda").insert({
                    id_produto: item.id_produto,
                    id_venda,                    
                    quantidade: item.quantidade,
                    valor_unitario: item.valor_unitario,
                    valor_total: item.valor_total,
                    valor_comissao: item.valor_comissao
                })
            }   
            response.status(201).json("Venda cadastrada com sucesso: " + id_venda);
        }        
    }
    

    async show(request, response){
        const { id } = request.params;

        const venda = await knex("vendas").where({ id }).first();  

        if(venda){  
            const produtos = await knex("itens_da_venda")
                .select([
                    "produtos.id",
                    "produtos.nome",
                    "produtos.descricao",
                    "produtos.categoria",
                    "produtos.tamanho",
                    "produtos.estoque_atual",                    
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

            return response.json({
                id: venda.id,                
                data_venda: venda.data_venda,   
                tipo_pagamento: venda.tipo_pagamento, 
                cliente,
                revendedor,          
                produtos
            });
        }else{
            throw new AppError("A Venda especificada não existe.", 404);
        };
    }

    async delete(request, response){
        const { id } = request.params;

        const deleted = await knex("vendas").where({ id }).delete();

        if(deleted){
            return response.json();
        }else{
            throw new AppError("A Venda especificada não existe.", 404);
        }
    }

    async index(request, response){    
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
                "produtos.estoque_atual",                    
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
            const [revendedor] = revendedores.filter(revendedor => revendedor.id == venda.id_revendedor);
            const [cliente] = clientes.filter(cliente => cliente.id == venda.id_cliente);

            return {
                id: venda.id,                
                data_venda: venda.data_venda,   
                tipo_pagamento: venda.tipo_pagamento, 
                cliente,
                revendedor,          
                produtosVenda           
            }
        });

        return response.json(insertVendas);                       
    }

    async update(request, response){
        const { id } = request.params;
        const { tipo_pagamento, data_venda, id_revendedor, id_cliente, itens } = request.body;   

        const venda = await knex("vendas").where({id}).first();    
           
        if(!venda){
            throw new AppError("A Venda especificada não existe.", 404);
        }  
        
        venda.tipo_pagamento = tipo_pagamento ?? venda.tipo_pagamento;
        venda.data_venda = data_venda ?? venda.data_venda;        
        venda.id_revendedor = id_revendedor ?? venda.id_revendedor;
        venda.id_cliente = id_cliente ?? venda.id_cliente;

        await knex("vendas").update(venda).where({ id });

        if(itens && itens.length){            
            await knex("itens_da_venda").where({id_venda: venda.id}).delete();

            for (const item of itens) {
                await knex("itens_da_venda").insert({
                    id_produto: item.id_produto,
                    id_venda: venda.id,                    
                    quantidade: item.quantidade,
                    valor_unitario: item.valor_unitario,
                    valor_total: item.valor_total,
                    valor_comissao: item.valor_comissao
                })
            }
        }

        await knex("vendas").update({updated_at: knex.fn.now()}).where({ id });

        return response.json("Venda alterada com sucesso!");  
    }  
}