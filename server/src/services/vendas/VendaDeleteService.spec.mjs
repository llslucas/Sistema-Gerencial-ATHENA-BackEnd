import VendasRepository from "../../repositories/VendasRepository.js";
import VendaDeleteService from "./VendaDeleteService.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import ClientesRepository from "../../repositories/ClientesRepository.js";
import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import AppError from "../../utils/AppError.js";
import { produtoTeste } from "../../utils/Examples.js";
import { revendedorTeste } from "../../utils/Examples.js";
import { clienteTeste } from "../../utils/Examples.js";

describe("VendaDeleteService", () =>{
  /** @type {VendasRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository = null;

  /** @type {ClientesRepository} */
  let clientesRepository = null;

  /** @type {RevendedoresRepository} */
  let revendedoresRepository = null;

  /** @type {VendaDeleteService} */
  let vendaDeleteService = null;  

  let venda_id;

  beforeAll( async() => {
    repository = new VendasRepository();        
    vendaDeleteService = new VendaDeleteService(repository); 
    produtosRepository = new ProdutosRepository();
    clientesRepository = new ClientesRepository();
    revendedoresRepository = new RevendedoresRepository();

    await repository.deleteAll();
    await produtosRepository.deleteAll();
    await clientesRepository.deleteAll();
    await revendedoresRepository.deleteAll();
  });   

  beforeEach( async() => {   
    const id_produto = await produtosRepository.create(produtoTeste);
    const id_revendedor = await revendedoresRepository.create(revendedorTeste);
    const id_cliente = await clientesRepository.create(clienteTeste);  

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

  it('A Venda deve ser excluída.', async () => {
    await expect(vendaDeleteService.execute({ id: venda_id })).resolves.toBeDefined();;
  });

  it('Caso a Venda não exista, retornar um AppError.', async () => {
    await expect(vendaDeleteService.execute({ id: venda_id + 1 })).rejects.toEqual(new AppError("A venda especificada não existe.", 404));
  });
  
});