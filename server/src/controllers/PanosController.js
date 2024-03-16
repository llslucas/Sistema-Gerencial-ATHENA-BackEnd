import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class PanosController{
    async create(request,response){
        const { revendedor_id, observacoes, itens } = request.body;   

        const revendedor = await knex("revendedores").where({id: revendedor_id}).first();        

        if(!revendedor){
            throw new AppError("O Revendedor especificado não existe.", 404);
        }else{
            const [pano_id] = await knex("panos").insert({
                revendedor_id,
                observacoes
            });

            if(itens){
                for (const item of itens) {
                    await knex("itens_do_pano").insert({
                        id_produto: item.id_produto,
                        id_pano: pano_id,
                        quantidade: item.quantidade,
                        valor_venda: item.valor_venda
                    })
                }   
            }  

            response.status(201).json("Novo pano cadastrado com sucesso: " + pano_id);
        }
    }

    async show(request, response){
        const { id } = request.params;

        const pano = await knex("panos").where({ id }).first();  

        if(pano){   
            const revendedor = await knex("revendedores")
                .select([
                    "revendedores.id",
                    "revendedores.nome",
                    "revendedores.contato",
                    "revendedores.comissao"
                ])
                .where({id: pano.revendedor_id}).first();            

            const produtos = await knex("itens_do_pano")
                .select([
                    "produtos.id",
                    "produtos.nome",
                    "produtos.descricao",
                    "produtos.categoria",
                    "produtos.tamanho",
                    "produtos.estoque_atual",
                    "itens_do_pano.quantidade",
                    "itens_do_pano.valor_venda"
                ])
                .innerJoin("produtos", "produtos.id", "itens_do_pano.id_produto")
                .where("itens_do_pano.id_pano", pano.id)
                .orderBy("produtos.categoria")
                .orderBy("produtos.nome")            

            return response.json({
                id: pano.id,
                observacoes: pano.observacoes,
                revendedor,
                produtos
            });
        }else{
            throw new AppError("O Pano especificado não existe.", 404);
        };
    }

    async delete(request, response){
        const { id } = request.params;

        const deleted = await knex("panos").where({ id }).delete();

        if(deleted){
            return response.json();
        }else{
            throw new AppError("O Pano especificado não existe.", 404);
        }
    }

    async index(request, response){    
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
                    "produtos.estoque_atual",
                    "itens_do_pano.quantidade",
                    "itens_do_pano.valor_venda",
                    "itens_do_pano.id_pano"
                ])
                .innerJoin("produtos", "produtos.id", "itens_do_pano.id_produto")
                .whereIn("itens_do_pano.id_pano", panos_id)
                .orderBy("produtos.categoria")
                .orderBy("produtos.nome") 
        
        const insertPanos = panos.map(pano => {
            const [ revendedor ] = revendedores.filter(revendedor => revendedor.id == pano.revendedor_id);
            const produtosPano = produtos.filter(produto => produto.id_pano == pano.id);

            return {
                id: pano.id,
                observacoes: pano.observacoes,
                revendedor,
                produtosPano                
            }
        });

        return response.json(insertPanos);                       
    }

    async update(request, response){
        const { id } = request.params;
        const { revendedor_id, observacoes, itens } = request.body;

        const pano = await knex("panos").where({id}).first();    
           
        if(!pano){
            throw new AppError("O Pano especificado não existe.", 404);
        }

        const revendedor = await knex("revendedores").where({id: revendedor_id}).first();     

        if(!revendedor){
            throw new AppError("O Revendedor especificado não existe.", 404);
        }

        pano.revendedor_id = revendedor_id ?? pano.revendedor_id;
        pano.observacoes = observacoes ?? pano.observacoes;          

        await knex("panos").update(pano).where({ id });

        if(itens){
            await knex("itens_do_pano").where({id_pano: pano.id}).delete();

            for (const item of itens) {
                await knex("itens_do_pano").insert({
                    id_produto: item.id_produto,
                    id_pano: pano.id,
                    quantidade: item.quantidade,
                    valor_venda: item.valor_venda
                })
            }
        }

        await knex("panos").update({updated_at: knex.fn.now()}).where({ id });

        return response.json("Pano alterado com sucesso!");  
    }  
}