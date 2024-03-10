import knex from "../database/knex/index.js";

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

        return response.json({
            cliente
        });
    }

    async delete(request, response){
        const { id } = request.params;

        await knex("clientes").where({ id }).delete();

        return response.json();
    }

    async index(request, response){
        const { nome } = request.query;      
        const { user_id } = request.params;
        const search = nome ?? '';        

        const clientes = await knex("clientes")
            .whereLike("clientes.nome", `%${search}%`)
            .orderBy("nome");

        return response.json(clientes);            
    }

    
}