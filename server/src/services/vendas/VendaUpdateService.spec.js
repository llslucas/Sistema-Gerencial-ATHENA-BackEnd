import VendasRepository from "../../repositories/VendasRepository.js";
import VendaUpdateService from "./VendaUpdateService.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import ClientesRepository from "../../repositories/ClientesRepository.js";
import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import EstoqueRepository from "../../repositories/EstoqueRepository.js";
import AppError from "../../utils/AppError.js";
import { produtoTeste, produtoTeste2 } from "../../utils/Examples.js";
import { revendedorTeste, revendedorTeste2 } from "../../utils/Examples.js";
import { clienteTeste, clienteTeste2 } from "../../utils/Examples.js";
import { formatVenda } from "../../utils/Format.js";
import AtualizaEstoqueService from "../estoque/AtualizaEstoqueService.js";

describe("VendaUpdateService", () =>{
  /** @type {VendasRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository = null;

  /** @type {ClientesRepository} */
  let clientesRepository = null;

  /** @type {RevendedoresRepository} */
  let revendedoresRepository = null;

  /** @type {VendaUpdateService} */
  let vendaUpdateService = null;  

  /** @type {EstoqueRepository} */
  let estoqueRepository = null;

  /** @type {AtualizaEstoqueService} */
  let atualizaEstoqueService = null;

  let venda_id;
  let id_produto;
  let id_produto2;
  let id_revendedor;
  let id_revendedor2;
  let id_cliente;
  let id_cliente2;

  beforeAll( async() => {
    repository = new VendasRepository();        
    vendaUpdateService = new VendaUpdateService(repository); 
    produtosRepository = new ProdutosRepository();
    clientesRepository = new ClientesRepository();
    revendedoresRepository = new RevendedoresRepository();
    estoqueRepository = new EstoqueRepository();    
    atualizaEstoqueService = new AtualizaEstoqueService({ estoqueRepository, produtosRepository});

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

    venda_id = await repository.create(vendaTeste);  
    atualizaEstoqueService.execute({id_produto});
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

  it("Atualizar uma venda que não existe deve retornar um AppError.", async () => {
    await expect(vendaUpdateService.execute({ id: venda_id + 1, tipo_pagamento: "Dinheiro" })).rejects.toEqual(new AppError("A venda especificada não existe.", 404));    
  });  

  it("Se nenhum campo for informado, retornar um AppError", async () => {
    await expect(vendaUpdateService.execute({ id: venda_id })).rejects.toEqual(new AppError("Pelo menos um campo a ser alterado deve ser informado."));   
  });

  it("Se algum produto que não existe for informado, retornar um AppError", async () => {
    const itens = [{
      id: id_produto2 + 1,
      quantidade: 10,
      valor_unitario: 22.22,
      valor_total: (22.22 * 10)
    }];

    await expect(vendaUpdateService.execute({ id: venda_id, itens })).rejects.toEqual(new AppError(`O Produto com o ID: ${id_produto2 + 1} não existe.`, 404));   
  });

  it("O Tipo do pagamento deve ser atualizado.", async() => {
    await vendaUpdateService.execute({ id: venda_id, tipo_pagamento: "Dinheiro" });

    const vendaEsperada = {      
      id: venda_id,     
      tipo_pagamento: "Dinheiro",  
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

    const vendaAlterada = formatVenda(await repository.show({ id: venda_id }));

    expect(vendaAlterada).toEqual(vendaEsperada);
  });

  it("A data da venda deve ser atualizada.", async() => {
    await vendaUpdateService.execute({ id: venda_id, data_venda: "10/10/2024" });

    const vendaEsperada = {      
      id: venda_id,     
      tipo_pagamento: "PIX",  
      data_venda: "10/10/2024",
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

    const vendaAlterada = formatVenda(await repository.show({ id: venda_id }));

    expect(vendaAlterada).toEqual(vendaEsperada);
  });

  it("O revendedor deve ser atualizado.", async() => {
    await vendaUpdateService.execute({ id: venda_id, id_revendedor: id_revendedor2 });

    const vendaEsperada = {      
      id: venda_id,     
      tipo_pagamento: "PIX",  
      data_venda: "08/10/2024",
      id_revendedor: id_revendedor2,
      id_cliente,
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10,
        valor_comissao: 10
      }]
    };

    const vendaAlterada = formatVenda(await repository.show({ id: venda_id }));

    expect(vendaAlterada).toEqual(vendaEsperada);
  });

  it("O cliente deve ser atualizado.", async() => {
    await vendaUpdateService.execute({ id: venda_id, id_cliente: id_cliente2 });

    const vendaEsperada = {      
      id: venda_id,     
      tipo_pagamento: "PIX",  
      data_venda: "08/10/2024",
      id_revendedor,
      id_cliente: id_cliente2,
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10,
        valor_comissao: 10
      }]
    };

    const vendaAlterada = formatVenda(await repository.show({ id: venda_id }));

    expect(vendaAlterada).toEqual(vendaEsperada);
  });  

  it("Os itens da venda devem ser atualizados.", async() => {
    const itens = [{
        id: id_produto2,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: (22.22 * 10),
        valor_comissao: 10
      },
      {
        id: id_produto,
        quantidade: 10,
        valor_unitario: 33,
        valor_total: (33 * 10),
        valor_comissao: 20
      }          
    ];    

    await vendaUpdateService.execute({ id: venda_id, itens });

    const vendaEsperada = {      
      id: venda_id,     
      tipo_pagamento: "PIX",  
      data_venda: "08/10/2024",
      id_revendedor,
      id_cliente,
      itens
    };

    const vendaAlterada = formatVenda(await repository.show({ id: venda_id }));    

    expect(vendaAlterada).toEqual(vendaEsperada);
  });

  it("Ao tentar atualizar um produto com uma quantidade maior que a disponível em estoque, retornar um AppError.", async() => {
    const itens = [
      {
        id: id_produto,
        quantidade: 15,
        valor_unitario: 33,
        valor_total: (33 * 10),
        valor_comissao: 20
      }          
    ];  

    await expect(vendaUpdateService.execute({ id: venda_id, itens })).rejects.toEqual(
      new AppError(
        `Não há saldo sufuciente do produto ${produtoTeste.nome} para alterar a venda. \n Saldo atual: ${0} \n Saldo Necessário: ${5}.`
      )
    );    
  });
  
  
});