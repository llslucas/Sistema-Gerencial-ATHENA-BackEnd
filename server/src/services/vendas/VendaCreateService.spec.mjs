import VendasRepository from "../../repositories/VendasRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import ClientesRepository from "../../repositories/ClientesRepository.js";
import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import VendaCreateService from "./VendaCreateService.js";
import AppError from "../../utils/AppError.js";
import { produtoTeste } from "../../utils/Examples.js";
import { revendedorTeste } from "../../utils/Examples.js";
import { clienteTeste } from "../../utils/Examples.js";

describe("VendaCreateService", () =>{
  /** @type {VendasRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository = null;

  /** @type {ClientesRepository} */
  let clientesRepository = null;

  /** @type {RevendedoresRepository} */
  let revendedoresRepository = null;

  /** @type {VendaCreateService} */
  let vendaCreateService = null;  

  let id_produto;
  let id_revendedor;
  let id_cliente;

  beforeAll( async() => {
    repository = new VendasRepository();        
    vendaCreateService = new VendaCreateService(repository); 
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
    id_revendedor = await revendedoresRepository.create(revendedorTeste);
    id_cliente = await clientesRepository.create(clienteTeste);
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

  it("O venda deve ser criada.", async () => {
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

    const venda_id = await vendaCreateService.execute(vendaTeste);   
    expect(venda_id).toBeDefined();    
  });  

  it("Caso o campo tipo_pagamento esteja em branco deve retornar um AppError.", async() => {
    const vendaTeste = {           
      tipo_pagamento: null,  
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

    await expect(vendaCreateService.execute(vendaTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas.", 400));
  });

  it("Caso o campo data_venda esteja em branco deve retornar um AppError.", async() => {
    const vendaTeste = {           
      tipo_pagamento: "PIX",  
      data_venda: null,
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

    await expect(vendaCreateService.execute(vendaTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas.", 400));
  });

  it("Caso o campo id_revendedor esteja em branco deve retornar um AppError.", async() => {
    const vendaTeste = {           
      tipo_pagamento: "PIX",  
      data_venda: "08/10/2024",
      id_revendedor: null,
      id_cliente,
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10,
        valor_comissao: 10
      }]
    };

    await expect(vendaCreateService.execute(vendaTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas.", 400));
  });

  it("Caso o campo id_cliente esteja em branco deve retornar um AppError.", async() => {
    const vendaTeste = {           
      tipo_pagamento: "PIX",  
      data_venda: "08/10/2024",
      id_revendedor,
      id_cliente: null,
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10,
        valor_comissao: 10
      }]
    };

    await expect(vendaCreateService.execute(vendaTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas.", 400));
  });

  it("Caso a venda não possua itens, retornar um AppError.", async() => {
    const vendaTeste = {           
      tipo_pagamento: "PIX",  
      data_venda: "08/10/2024",
      id_revendedor,
      id_cliente,
      itens: null
    };

    await expect(vendaCreateService.execute(vendaTeste)).rejects.toEqual(new AppError("Não é possível cadastrar uma venda sem itens.", 400));
  });

  it("Caso a venda possua um item que não existe, retornar um AppError.", async() => {
    const vendaTeste = {           
      tipo_pagamento: "PIX",  
      data_venda: "08/10/2024",
      id_revendedor,
      id_cliente,
      itens:[{
        id: id_produto + 1,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10,
        valor_comissao: 10
      }]
    };

    await expect(vendaCreateService.execute(vendaTeste)).rejects.toEqual(new AppError(`O Produto com o ID: ${id_produto + 1} não existe.`, 404));
  });

  it("Caso o revendedor não exista, retornar um AppError.", async() => {
    const vendaTeste = {           
      tipo_pagamento: "PIX",  
      data_venda: "08/10/2024",
      id_revendedor: id_revendedor + 1,
      id_cliente,
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10,
        valor_comissao: 10
      }]
    };

    await expect(vendaCreateService.execute(vendaTeste)).rejects.toEqual(new AppError("Revendedor inválido.", 404));
  });

  it("Caso o cliente não exista, retornar um AppError.", async() => {
    const vendaTeste = {           
      tipo_pagamento: "PIX",  
      data_venda: "08/10/2024",
      id_revendedor,
      id_cliente: id_cliente + 1,
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10,
        valor_comissao: 10
      }]
    };

    await expect(vendaCreateService.execute(vendaTeste)).rejects.toEqual(new AppError("Cliente inválido.", 404));
  });

});