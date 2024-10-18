import PanosRepository from "../repositories/PanosRepository.js";
import PanoCreateService from "../services/panos/PanoCreateService.js";
import PanoDeleteService from "../services/panos/PanoDeleteService.js";
import PanoSearchService from "../services/panos/PanoSearchService.js";
import PanoShowService from "../services/panos/PanoShowService.js";
import PanoUpdateService from "../services/panos/PanoUpdateService.js";

export default class PanosController{   
    async create(request,response){
        const { id_revendedor, observacoes, itens } = request.body;   

        const repository = new PanosRepository();
        const service = new PanoCreateService(repository);
        
        const pano_id = await service.execute({ id_revendedor, observacoes, itens });

        return response.status(201).json("Novo pano cadastrado com sucesso: " + pano_id);
    }    

    async show(request, response){
        const { id } = request.params;

        const repository = new PanosRepository();
        const service = new PanoShowService(repository);

        const pano = await service.execute({ id });

        response.json(pano);
    }

    async delete(request, response){
        const { id } = request.params;
        
        const repository = new PanosRepository();
        const service = new PanoDeleteService(repository);

        await service.execute({ id });
        
        return response.json();        
    }

    async index(request, response){    
        const { search } = request.query;

        const repository = new PanosRepository();
        const service = new PanoSearchService(repository);

        const panos = await service.execute({ search });

        return response.json(panos);                       
    }

    async update(request, response){
        const { id } = request.params;
        const { revendedor_id, observacoes, itens } = request.body;

        const repository = new PanosRepository();
        const service = new PanoUpdateService(repository);

        await service.execute({ id, revendedor_id, observacoes, itens });

        return response.json("Pano alterado com sucesso!");  
    }  
}