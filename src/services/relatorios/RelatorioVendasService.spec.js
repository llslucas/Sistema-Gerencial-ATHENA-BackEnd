import VendasRepository from "../../repositories/VendasRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import ClientesRepository from "../../repositories/ClientesRepository.js";
import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import RelatorioVendasService from "./RelatorioVendasService.js";
import RelatorioExcel from "../../Excel/RelatorioExcel.js";
import AppError from "../../utils/AppError.js";
import { produtoTeste, produtoTeste2 } from "../../utils/Examples.js";
import { revendedorTeste, revendedorTeste2 } from "../../utils/Examples.js";
import { clienteTeste, clienteTeste2 } from "../../utils/Examples.js";

describe("RelatorioVendasService", () =>{
  /** @type {VendasRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository = null;

  /** @type {ClientesRepository} */
  let clientesRepository = null;

  /** @type {RevendedoresRepository} */
  let revendedoresRepository = null;

  /** @type {RelatorioVendasService} */
  let relatorioVendasService = null;  

  let id_produto;  
  let id_produto2;
  let id_revendedor;
  let id_revendedor2;
  let id_cliente;
  let id_cliente2;

  beforeAll( async() => {
    repository = new VendasRepository();        
    relatorioVendasService = new RelatorioVendasService(repository); 
    produtosRepository = new ProdutosRepository();
    clientesRepository = new ClientesRepository();
    revendedoresRepository = new RevendedoresRepository();

    await repository.deleteAll();
    await produtosRepository.deleteAll();
    await clientesRepository.deleteAll();
    await revendedoresRepository.deleteAll();
  });  

  beforeEach( async() => {   
    id_produto = await produtosRepository.create(produtoTeste);
    id_produto2 = await produtosRepository.create(produtoTeste2);
    id_revendedor = await revendedoresRepository.create(revendedorTeste);
    id_revendedor2 = await revendedoresRepository.create(revendedorTeste2);
    id_cliente = await clientesRepository.create(clienteTeste);
    id_cliente2 = await clientesRepository.create(clienteTeste2);

    const vendaTeste1 = {           
      tipo_pagamento: "PIX",  
      data_venda: "08/10/2024",
      id_revendedor,
      id_cliente,
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10,
        valor_comissao: 10
      }]
    };

    const vendaTeste2 = {           
      tipo_pagamento: "PIX",  
      data_venda: "15/10/2024",
      id_revendedor: id_revendedor2,
      id_cliente: id_cliente2,
      itens:[{
        id: id_produto2,
        quantidade: 5,
        valor_unitario: 50,
        valor_total: 50 * 10,
        valor_comissao: 10
      }]
    };

    const vendaTeste3 = {           
      tipo_pagamento: "PIX",  
      data_venda: "20/10/2024",
      id_revendedor: id_revendedor2,
      id_cliente: id_cliente2,
      itens:[{
        id: id_produto2,
        quantidade: 5,
        valor_unitario: 60,
        valor_total: 60 * 10,
        valor_comissao: 10
      }]
    };

    await repository.create(vendaTeste1);
    await repository.create(vendaTeste2);
    await repository.create(vendaTeste3);
  })

  afterEach( async() => {
    await repository.deleteAll();
    await produtosRepository.deleteAll();
    await clientesRepository.deleteAll();
    await revendedoresRepository.deleteAll();
  });

  afterAll( async () => { 
    await repository.disconnect();
    await produtosRepository.disconnect();
    await revendedoresRepository.disconnect();
    await clientesRepository.disconnect();
  });

  it("Uma Planilha deve ser retornada.", async () => {  
    const relatorio = await relatorioVendasService.execute({startDate: "08/10/2024", endDate: "20/10/2024"});
    expect(relatorio).toBeInstanceOf(RelatorioExcel);    
  });  

  it("A planilha deve conter duas vendas no intervalo de data de 8/10 a 15/10.", async () => {  
    const relatorio = await relatorioVendasService.execute({startDate: "08/10/2024", endDate: "15/10/2024"});
    expect(relatorio.getRowCount()).toBe(3);    
  });  

  it("A planilha deve conter uma vendas no intervalo de data de 8/10 a 08/10.", async () => {  
    const relatorio = await relatorioVendasService.execute({startDate: "08/10/2024", endDate: "08/10/2024"});
    expect(relatorio.getRowCount()).toBe(2);    
  });  

  it("Caso os campos startDate ou EndDate não sejam mencionados, retornar um AppError.", async () => { 
    await expect(relatorioVendasService.execute({})).rejects.toEqual(new AppError("Os campos startDate e endDate são necessários."));
  }); 

  it("Caso o intervalo de datas não retorne nenhum resultado, retornar um AppError.", async () => { 
    await expect(relatorioVendasService.execute({startDate: "08/10/2025", endDate: "08/10/2025"})).rejects.toEqual(new AppError("A pesquisa não retornou resultados.", 404));
  });   
});