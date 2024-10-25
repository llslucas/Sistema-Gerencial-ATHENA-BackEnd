import ClientesRepository from "../repositories/ClientesRepository.js";
import ClienteCreateService from "../services/clientes/ClienteCreateService.js";
import ClienteShowService from "../services/clientes/ClienteShowService.js";
import ClienteDeleteService from "../services/clientes/ClienteDeleteService.js";
import ClienteSearchService from "../services/clientes/ClienteSearchService.js";
import ClienteUpdateService from "../services/clientes/ClienteUpdateService.js";

export default class ClientesController{
    async create(request,response){
        const { nome, telefone, email } = request.body;

        const repository = new ClientesRepository();
        const service = new ClienteCreateService(repository);
        
        const cliente_id = await service.execute({ nome, telefone, email });

        return response.status(201).json("Novo cliente cadastrado com sucesso: " + cliente_id);
    }

    async show(request, response){
        const { id } = request.params;

        const repository = new ClientesRepository();
        const service = new ClienteShowService(repository);

        const cliente = await service.execute({ id });
        
        return response.json(cliente);
    }

    async delete(request, response){
        const { id } = request.params;
        
        const repository = new ClientesRepository();
        const service = new ClienteDeleteService(repository);

        await service.execute({ id });
         
        return response.json("Cliente excluído com sucesso!");            
    }

    async index(request, response){
        const { nome } = request.query;         
        
        const repository = new ClientesRepository();
        const service = new ClienteSearchService(repository);

        const clientes = await service.execute({search: nome});

        return response.json(clientes);
    }

    async update(request, response){
        const { id } = request.params;
        const { nome, telefone, email } = request.body;

        const repository = new ClientesRepository();
        const service = new ClienteUpdateService(repository);

        await service.execute({ id, nome, telefone, email });

        return response.json("Cliente alterado com sucesso!");  
    }  
}