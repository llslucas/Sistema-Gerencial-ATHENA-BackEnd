import VendasRepository from "../../repositories/VendasRepository.js";
import VendaShowService from "./VendaShowService.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import ClientesRepository from "../../repositories/ClientesRepository.js";
import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import AppError from "../../utils/AppError.js";
import { produtoTeste } from "../../utils/Examples.js";
import { revendedorTeste } from "../../utils/Examples.js";
import { clienteTeste } from "../../utils/Examples.js";

describe("VendaShowService", () =>{
  /** @type {VendasRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository = null;

  /** @type {ClientesRepository} */
  let clientesRepository = null;

  /** @type {RevendedoresRepository} */
  let revendedoresRepository = null;

  /** @type {VendaShowService} */
  let vendaShowService = null;  

  let venda_id;
  let id_produto;
  let id_revendedor;
  let id_cliente;

  beforeAll( async() => {
    repository = new VendasRepository();        
    vendaShowService = new VendaShowService(repository); 
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

    venda_id = await repository.create(vendaTeste);  
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

  it("A Venda deve ser retornada.", async () => {
    const venda = await vendaShowService.execute({id: venda_id});        
    expect(venda).toBeDefined();
  });

  it("Caso a venda não exista, retornar um AppError.", async () => {       
    await expect(vendaShowService.execute({id: venda_id + 1})).rejects.toEqual(new AppError("A Venda especificada não existe.", 404));
  });
  
  
});