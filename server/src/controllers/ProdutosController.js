import knex from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

export default class ProdutosController{
    async create(request, response){
        const { nome, descricao, categoria, tamanho } = request.body;

        const [produtoId] = await knex("produtos").insert({
            nome,
            descricao,
            categoria,
            tamanho
        });

        response.status(201).json("Produto cadastrado com sucesso!");
    }   

    async show(request, response){
        const { id } = request.params;

        const produto = await knex("produtos").where({ id }).first();

        if(produto){
            return response.json(produto);
        }else{
            throw new AppError("O Produto especificado não existe.", 404);
        };
    }

    async delete(request, response){
        const { id } = request.params;

        const deleted = await knex("produtos").where({ id }).delete();

        if(deleted){
            return response.json();
        }else{
            throw new AppError("O Produto especificado não existe.", 404);
        }
    }

    async index(request, response){
        const { nome } = request.query; 
        const search = nome ?? '';        

        const produtos = await knex("produtos")
            .whereLike("produtos.nome", `%${search}%`)
            .orderBy("nome");

        return response.json(produtos);            
    }

    async update(request, response){
        const { id } = request.params;
        const { nome, descricao, categoria, tamanho } = request.body;

        const produto = await knex("produtos").where({id}).first();            

        if(!produto){
            throw new AppError("O Cliente especificado não existe.", 404);
        }

        produto.nome = nome ?? produto.nome;
        produto.descricao = descricao ?? produto.descricao;
        produto.categoria = categoria ?? produto.categoria;  
        produto.tamanho = tamanho ?? produto.tamanho;      

        await knex("produtos").update(produto).where({ id });
        await knex("produtos").update({updated_at: knex.fn.now()}).where({ id });

        return response.json("Produto alterado com sucesso!");  
    }  
}