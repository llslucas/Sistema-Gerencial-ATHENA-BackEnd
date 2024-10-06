import ComprasRepository from "../repositories/ComprasRepository.js";
import CompraCreateService from "../services/compras/CompraCreateService.js";
import CompraDeleteService from "../services/compras/CompraDeleteService.js";
import CompraSearchService from "../services/compras/CompraSearchService.js";
import CompraShowService from "../services/compras/CompraShowService.js";
import CompraUpdateService from "../services/compras/CompraUpdateService.js";

export default class ComprasController{
    async create(request,response){
        const { numero_nota, fornecedor, data_compra, itens } = request.body;  
        const repository = new ComprasRepository();
        const service = new CompraCreateService(repository);

        const id_compra = await service.execute({ numero_nota, fornecedor, data_compra, itens });
    
        response.status(201).json("Compra cadastrada com sucesso: " + id_compra);
    }  

    async show(request, response){
        const { id } = request.params;

        const repository = new ComprasRepository();
        const service = new CompraShowService(repository);

        const compra = await service.execute({ id });              

        return response.json(compra);        
    }

    async delete(request, response){
        const { id } = request.params;

        const repository = new ComprasRepository();
        const service = new CompraDeleteService(repository);

        await service.execute({ id });

        return response.status(200).json();
    }

    async index(request, response){    
        const { search } = request.query;

        const repository = new ComprasRepository();
        const service = new CompraSearchService(repository);

        const compras = await service.execute({ search });

        return response.json(compras);                       
    }

    async update(request, response){
        const { id } = request.params;
        const { numero_nota, fornecedor, data_compra, itens } = request.body; 

        const repository = new ComprasRepository();
        const service = new CompraUpdateService(repository);

        await service.execute({ id, numero_nota, fornecedor, data_compra, itens });

        return response.json("Compra alterada com sucesso!");  
    }  
}