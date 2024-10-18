import VendasRepository from "../repositories/VendasRepository.js";
import VendaCreateService from "../services/vendas/VendaCreateService.js";
import VendaShowService from "../services/vendas/VendaShowService.js";
import VendaDeleteService from "../services/vendas/VendaDeleteService.js"
import VendaSearchService from "../services/vendas/VendaSearchService.js";
import VendaUpdateService from "../services/vendas/VendaUpdateService.js";

import ProdutosRepository from "../repositories/ProdutosRepository.js";
import EstoqueRepository from "../repositories/EstoqueRepository.js";
import AtualizaEstoqueService from "../services/estoque/AtualizaEstoqueService.js";

export default class VendasController{
    async create(request,response){
        const { tipo_pagamento, data_venda, id_revendedor, id_cliente, itens } = request.body;   

        const repository = new VendasRepository();
        const service = new VendaCreateService(repository);

        const id_venda = await service.execute({ tipo_pagamento, data_venda, id_revendedor, id_cliente, itens });    
        
        const produtosRepository = new ProdutosRepository();
        const estoqueRepository = new EstoqueRepository();
        const atualizaEstoqueService = new AtualizaEstoqueService({ estoqueRepository, produtosRepository });

        for(const item of itens){         
            await atualizaEstoqueService.execute({id_produto: item.id});
        }
        
        response.status(201).json(`Venda ${ id_venda } cadastrada com sucesso: `);
    }      

    async show(request, response){
        const { id } = request.params;

        const repository = new VendasRepository();
        const service = new VendaShowService(repository);

        const venda = await service.execute({ id });
        
        return response.json(venda);
    }

    async delete(request, response){
        const { id } = request.params;

        const repository = new VendasRepository();
        const service = new VendaDeleteService(repository);

        const vendaExcluida = await service.execute({ id });

        const produtosRepository = new ProdutosRepository();
        const estoqueRepository = new EstoqueRepository();
        const atualizaEstoqueService = new AtualizaEstoqueService({ estoqueRepository, produtosRepository });

        for(const item of vendaExcluida.itens){         
            await atualizaEstoqueService.execute({id_produto: item.id});
        }

        return response.json("Venda excluída com sucesso!");        
    }

    async index(request, response){    
        const { search } = request.params;
        
        const repository = new VendasRepository();
        const service = new VendaSearchService(repository);

        const vendas = await service.execute({ search });

        return response.json(vendas);
    }

    async update(request, response){
        const { id } = request.params;
        const { tipo_pagamento, data_venda, id_revendedor, id_cliente, itens } = request.body;   

        const repository = new VendasRepository();
        const service = new VendaUpdateService(repository);

        await service.execute({ id, tipo_pagamento, data_venda, id_revendedor, id_cliente, itens });

        const produtosRepository = new ProdutosRepository();
        const estoqueRepository = new EstoqueRepository();
        const atualizaEstoqueService = new AtualizaEstoqueService({ estoqueRepository, produtosRepository });

        for(const item of itens){         
            await atualizaEstoqueService.execute({id_produto: item.id});
        }

        return response.json("Venda alterada com sucesso!");  
    }  
}