import ProdutosRepository from "../repositories/ProdutosRepository.js";
import ProdutoCreateService from "../services/produtos/ProdutoCreateService.js";
import ProdutoDeleteService from "../services/produtos/ProdutoDeleteService.js";
import ProdutoSearchService from "../services/produtos/ProdutoSearchService.js";
import ProdutoShowService from "../services/produtos/ProdutoShowService.js";
import ProdutoUpdateService from "../services/produtos/ProdutoUpdateService.js";

export default class ProdutosController{
    async create(request, response){
        const { nome, descricao, categoria, tamanho, estoque_atual } = request.body;   

        const repository = new ProdutosRepository();
        const service = new ProdutoCreateService(repository);

        await service.execute({ nome, descricao, categoria, tamanho, estoque_atual });
        
        return response.status(201).json("Produto cadastrado com sucesso!");
    }   

    async show(request, response){
        const { id } = request.params;

        const repository = new ProdutosRepository();
        const service = new ProdutoShowService(repository);

        const produto = await service.execute({id});
        
        return response.json(produto);        
    }

    async delete(request, response){
        const { id } = request.params;

        const repository = new ProdutosRepository();
        const service = new ProdutoDeleteService(repository);

        await service.execute({ id });

        return response.json("Produto excluído com sucesso!");
    }

    async index(request, response){
        const { nome } = request.query; 

        const repository = new ProdutosRepository();
        const service = new ProdutoSearchService(repository);

        const produtos = await service.execute({ search: nome });

        return response.json(produtos);            
    }

    async update(request, response){
        const { id } = request.params;
        const { nome, descricao, categoria, tamanho, estoque_atual } = request.body;

        const repository = new ProdutosRepository();
        const service = new ProdutoUpdateService(repository);

        await service.execute({ id, nome, descricao, categoria, tamanho, estoque_atual })

        return response.json("Produto alterado com sucesso!");  
    }  
}