import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class PanosController{
    async create(request,response){
        const { revendedor_id, observacoes } = request.body;   

        const revendedor = await knex("revendedores").where({id: revendedor_id}).first();        

        if(!revendedor){
            throw new AppError("O Revendedor especificado não existe.", 404);
        }else{
            const [pano_id] = await knex("panos").insert({
                revendedor_id,
                observacoes
            });

            response.status(201).json("Novo pano cadastrado com sucesso: " + pano_id);
        }
    }

    async show(request, response){
        const { id } = request.params;

        const pano = await knex("panos").where({ id }).first();        

        if(pano){
            const revendedor = await knex("revendedores").where({id: pano.revendedor_id}).first();

            return response.json({
                ...pano,
                revendedor
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
        const revendedor = await knex("revendedores");
        
        const insertPanos = panos.map(pano => {
            const revendedorPano = revendedor.filter(revendedor => revendedor.id == pano.revendedor_id);

            return {
                ...pano,
                revendedorPano
            }
        });

        return response.json(insertPanos);                       
    }

    async update(request, response){
        const { id } = request.params;
        const { revendedor_id, observacoes } = request.body;

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
        await knex("panos").update({updated_at: knex.fn.now()}).where({ id });

        return response.json("Pano alterado com sucesso!");  
    }  
}