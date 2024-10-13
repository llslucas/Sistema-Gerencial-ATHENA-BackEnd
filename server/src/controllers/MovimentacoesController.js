import MovimentacoesRepository from "../repositories/MovimentacoesRepository.js";
import MovimentacaoCreateService from "../services/movimentacoes/MovimentacaoCreateService.js";
import MovimentacaoDeleteService from "../services/movimentacoes/MovimentacaoDeleteService.js";
import MovimentacaoSearchService from "../services/movimentacoes/MovimentacaoSearchService.js";
import MovimentacaoShowService from "../services/movimentacoes/MovimentacaoShowService.js";
import MovimentacaoUpdateService from "../services/movimentacoes/MovimentacaoUpdateService.js";

export default class MovimentacoesController{
    async create(request,response){
        const { descricao, data_movimentacao, itens } = request.body;     
        
        const repository = new MovimentacoesRepository();
        const service = new MovimentacaoCreateService(repository);
        
        const id_movimentacao = await service.execute({ descricao, data_movimentacao, itens });        
        
        response.status(201).json("Movimentação cadastrada com sucesso: " + id_movimentacao);               
    }    

    async show(request, response){
        const { id } = request.params;

        const repository = new MovimentacoesRepository();
        const service = new MovimentacaoShowService(repository);

        const movimentacao = await service.execute({ id });
        
        response.json(movimentacao);            
    }

    async delete(request, response){
        const { id } = request.params;

        const repository = new MovimentacoesRepository();
        const service = new MovimentacaoDeleteService(repository);

        await service.execute({ id });

        response.json("Movimentação Excluída com sucesso!");
    }

    async index(request, response){    
        const { search } = request.query;

        const repository = new MovimentacoesRepository();
        const service = new MovimentacaoSearchService(repository);

        const movimentacoes = await service.execute({ search });
        
        return response.json(movimentacoes);                       
    }

    async update(request, response){
        const { id } = request.params;
        const { descricao, data_movimentacao, itens } = request.body;  

        const repository = new MovimentacoesRepository();
        const service = new MovimentacaoUpdateService(repository);

        await service.execute({ id, descricao, data_movimentacao, itens });

        return response.json("Movimentação alterada com sucesso!");  
    }  
}