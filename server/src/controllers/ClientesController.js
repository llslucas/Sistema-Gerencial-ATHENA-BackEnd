import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class ClientesController{
    async create(request,response){
        const { nome, telefone, email } = request.body;

        const [cliente_id] = await knex("clientes").insert({
            nome,
            telefone,
            email
        });

        response.status(201).json("Novo cliente cadastrado com sucesso: " + cliente_id);
    }

    async show(request, response){
        const { id } = request.params;

        const cliente = await knex("clientes").where({ id }).first();

        if(cliente){
            return response.json(cliente);
        }else{
            throw new AppError("O Cliente especificado não existe.", 404);
        };
    }

    async delete(request, response){
        const { id } = request.params;

        const deleted = await knex("clientes").where({ id }).delete();

        if(deleted){
            return response.json();
        }else{
            throw new AppError("O Cliente especificado não existe.", 404);
        }
    }

    async index(request, response){
        const { nome } = request.query; 
        const search = nome ?? '';        

        const clientes = await knex("clientes")
            .whereLike("clientes.nome", `%${search}%`)
            .orderBy("nome");

        return response.json(clientes);            
    }

    async update(request, response){
        const { id } = request.params;
        const { nome, telefone, email } = request.body;

        const cliente = await knex("clientes").where({id}).first();            

        if(!cliente){
            throw new AppError("O Cliente especificado não existe.", 404);
        }

        cliente.nome = nome ?? cliente.nome;
        cliente.telefone = telefone ?? cliente.telefone;
        cliente.email = email ?? cliente.email;    

        await knex("clientes").update(cliente).where({ id });
        await knex("clientes").update({updated_at: knex.fn.now()}).where({ id });

        return response.json("Cliente alterado com sucesso!");  
    }  
}