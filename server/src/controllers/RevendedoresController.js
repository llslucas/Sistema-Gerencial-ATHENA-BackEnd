import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class RevendedoresController{
    async create(request, response){
        const { nome, contato, comissao } = request.body;

        const [revendedorId] = await knex("revendedores").insert({
            nome,
            contato,
            comissao
        });

        response.status(201).json("Revendedor cadastrado com sucesso!");
    }

    async index(request, response){
        const { nome } = request.query;
        const search = nome ?? '';

        const revendedores = await knex("revendedores")
            .whereLike("nome", `%${search}%`)
            .orderBy("nome");

        return response.json(revendedores);        
    }
    
    async show(request, response){
        const{ id } = request.params;

        const revendedor = await knex("revendedores").where({ id }).first();

        if(revendedor){
            return response.json(revendedor);
        }else{
            throw new AppError("O revendedor especificado não existe.", 404);
        }
    }

    async delete(request, response){
        const { id } = request.params;

        const deleted = await knex("revendedores").where({ id }).delete();

        if(deleted){
            return response.json("Revendedor excluído com sucesso!");
        }else{
            throw new AppError("O revendedor especificado não existe.", 404);
        }
    }

    async update(request, response){
        const { id } = request.params;
        const { nome, contato, comissao } = request.body;

        const revendedor = await knex("revendedores").where({ id }).first();

        if(!revendedor){
            throw new AppError("O revendedor especificado não existe");
        }

        revendedor.nome = nome ?? revendedor.nome;
        revendedor.contato = contato ?? revendedor.contato;
        revendedor.comissao = comissao ?? revendedor.comissao;        

        await knex("revendedores").where({ id }).update(revendedor);       
        await knex("revendedores").where({ id }).update({created_at: knex.fn.now()});  
        
        return response.json("Revendedor alterado com sucesso!");
    }
}

