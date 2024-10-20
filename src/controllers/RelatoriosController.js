import VendasRepository from '../repositories/VendasRepository.js';
import RelatorioVendasService from '../services/relatorios/RelatorioVendasService.js';

export default class RelatoriosController{
  async relatorioVendas(req, res){
    const { startDate, endDate } = req.query;    

    const repository = new VendasRepository();
    const service = new RelatorioVendasService(repository);
    
    const relatorio = await service.execute({ startDate, endDate });    

    await relatorio.send(res, "Relatório Vendas");
  }
}

