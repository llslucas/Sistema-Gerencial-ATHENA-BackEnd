import RevendedoresRepository from "../repositories/RevendedoresRepository.js";
import RevendedorCreateService from "../services/revendedores/RevendedorCreateService.js";
import RevendedorDeleteService from "../services/revendedores/RevendedorDeleteService.js";
import RevendedorSearchService from "../services/revendedores/RevendedorSearchService.js";
import RevendedorShowService from "../services/revendedores/RevendedorShowService.js";
import RevendedorUpdateService from "../services/revendedores/RevendedorUpdateService.js";

export default class RevendedoresController{
    async create(request, response){
        const { nome, contato, comissao } = request.body;

        const repository = new RevendedoresRepository();
        const service = new RevendedorCreateService(repository);

        await service.execute({ nome, contato, comissao });

        return response.status(201).json("Revendedor cadastrado com sucesso!");
    }

    async index(request, response){
        const { nome } = request.query;
        
        const repository = new RevendedoresRepository();
        const service = new RevendedorSearchService(repository);

        const revendedores = await service.execute({ search: nome });        

        return response.json(revendedores);        
    }
    
    async show(request, response){
        const{ id } = request.params;

        const repository = new RevendedoresRepository();
        const service = new RevendedorShowService(repository);     

        const revendedor = await service.execute({ id });

        return response.json(revendedor);
    }

    async delete(request, response){
        const { id } = request.params;

        const repository = new RevendedoresRepository();
        const service = new RevendedorDeleteService(repository); 

        await service.execute({ id });

        return response.json("Revendedor excluído com sucesso!");
    }

    async update(request, response){
        const { id } = request.params;
        const { nome, contato, comissao } = request.body;

        const repository = new RevendedoresRepository();
        const service = new RevendedorUpdateService(repository); 

        await service.execute({ id, nome, contato, comissao });
        
        return response.json("Revendedor alterado com sucesso!");
    }
}

