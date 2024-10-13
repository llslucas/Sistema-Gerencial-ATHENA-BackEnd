import VendasRepository from "../../repositories/VendasRepository.js";
import VendaSearchService from "./VendaSearchService.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import ClientesRepository from "../../repositories/ClientesRepository.js";
import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import { produtoTeste, produtoTeste2 } from "../../utils/Examples.js";
import { revendedorTeste, revendedorTeste2 } from "../../utils/Examples.js";
import { clienteTeste, clienteTeste2 } from "../../utils/Examples.js";
import { formatVenda } from "../../utils/Format.js";

describe("VendaSearchService", () =>{
  /** @type {VendasRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository = null;

  /** @type {ClientesRepository} */
  let clientesRepository = null;

  /** @type {RevendedoresRepository} */
  let revendedoresRepository = null;

  /** @type {VendaSearchService} */
  let vendaSearchService = null;  

  let venda_id;
  let venda_id2;
  let id_produto;
  let id_produto2;
  let id_revendedor;
  let id_revendedor2;
  let id_cliente;
  let id_cliente2;

  beforeAll( async() => {
    repository = new VendasRepository();        
    vendaSearchService = new VendaSearchService(repository); 
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

    const vendaTeste = {           
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
      tipo_pagamento: "Dinheiro",  
      data_venda: "10/10/2024",
      id_revendedor: id_revendedor2,
      id_cliente: id_cliente2,
      itens:[{
        id: id_produto2,
        quantidade: 30,
        valor_unitario: 25,
        valor_total: 25 * 10,
        valor_comissao: 5
      }]
    };

    venda_id = await repository.create(vendaTeste);  
    venda_id2 = await repository.create(vendaTeste2);  
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
  
  it("Uma busca em branco deve retornar todas as vendas.", async () => {
    const vendas = await vendaSearchService.execute({search: ""});
    expect(vendas).toHaveLength(2);
  });

  it("Uma busca pelo ID deve retornar a venda esperada.", async () => {
    const vendas = await vendaSearchService.execute({search: venda_id}); 

    const vendaProcurada = [{    
      id: venda_id,      
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
    }];

    const vendasEncontradas = vendas.map(formatVenda);
    
    expect(vendasEncontradas).toEqual(vendaProcurada);
  });

  it("Uma busca pelo Tipo de Pagamento deve retornar a venda esperada.", async () => {
    const vendas = await vendaSearchService.execute({search: "PIX"}); 

    const vendaProcurada = [{    
      id: venda_id,      
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
    }];

    const vendasEncontradas = vendas.map(formatVenda);
    
    expect(vendasEncontradas).toEqual(vendaProcurada);
  });

  it("Uma busca pela Data da Venda deve retornar a venda esperada.", async () => {
    const vendas = await vendaSearchService.execute({search: "08/10/2024"}); 

    const vendaProcurada = [{    
      id: venda_id,      
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
    }];

    const vendasEncontradas = vendas.map(formatVenda);
    
    expect(vendasEncontradas).toEqual(vendaProcurada);
  });

  it("Uma busca pelo Revendedor deve retornar a venda esperada.", async () => {
    const vendas = await vendaSearchService.execute({search: "Revendedor Teste"}); 

    const vendaProcurada = [{    
      id: venda_id,
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
    }];

    const vendasEncontradas = vendas.map(formatVenda);
    
    expect(vendasEncontradas).toEqual(vendaProcurada);
  });

  it("Uma busca pelo Cliente deve retornar a venda esperada.", async () => {
    const vendas = await vendaSearchService.execute({search: "Cliente Teste"}); 

    const vendaProcurada = [{    
      id: venda_id,
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
    }];

    const vendasEncontradas = vendas.map(formatVenda);
    
    expect(vendasEncontradas).toEqual(vendaProcurada);
  });

  it("Uma busca pelo Produto deve retornar a venda esperada.", async () => {
    const vendas = await vendaSearchService.execute({search: "Produto Teste"}); 

    const vendaProcurada = [{    
      id: venda_id,
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
    }];

    const vendasEncontradas = vendas.map(formatVenda);
    
    expect(vendasEncontradas).toEqual(vendaProcurada);
  });

  it("Uma busca incorreta deve retornar um array vazio.", async () => {
    const vendas = await vendaSearchService.execute({search: "Produto 0"}); 

    expect(vendas).toHaveLength(0);
  });  
  
});