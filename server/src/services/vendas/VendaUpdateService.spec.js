import VendasRepository from "../../repositories/VendasRepository.js";
import VendaUpdateService from "./VendaUpdateService.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import ClientesRepository from "../../repositories/ClientesRepository.js";
import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import AppError from "../../utils/AppError.js";

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
    vendaUpdateService = new VendaUpdateService(repository); 
    produtosRepository = new ProdutosRepository();
    clientesRepository = new ClientesRepository();
    revendedoresRepository = new RevendedoresRepository();

    await repository.deleteAll();
    await produtosRepository.deleteAll();
    await clientesRepository.deleteAll();
    await revendedoresRepository.deleteAll();
  });   

  beforeEach( async() => {  
    const produtoTeste = {           
      nome: "Produto Teste",
      descricao: "Produto criado para fins de teste",
      categoria: "T",
      tamanho: 10,
      estoque_atual: 10
    };

    const produtoTeste2 = {           
      nome: "Produto Novo",
      descricao: "Produto criado para fins de teste",
      categoria: "T",
      tamanho: 10,
      estoque_atual: 10
    };

    const revendedorTeste = {           
      nome: "Revendedor Teste",
      contato: "123456",
      comissao: 20
    }

    const revendedorTeste2 = {           
      nome: "Revendedor Novo",
      contato: "123456",
      comissao: 20
    }

    const clienteTeste = {           
      nome: "Cliente Teste",
      telefone: "123456",
      email: "teste@email.com"      
    };

    const clienteTeste2 = {           
      nome: "Cliente Novo",
      telefone: "123456",
      email: "teste@email.com"      
    };

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
        id_produto,
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
        id_produto: id_produto2,
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

  //Função para usar como callback no map, formata a venda obtida na query para ficar igual ao array de cadastro.
  function formatVenda(venda){     
      const itensVenda = venda.itens.map(item => {
        return{
          id_produto: item.id,
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total,
          valor_comissao: item.valor_comissao
        }
      });

      return {
        id: venda.id,
        tipo_pagamento: venda.tipo_pagamento,
        data_venda: venda.data_venda,
        id_revendedor: venda.revendedor.id,
        id_cliente: venda.cliente.id,
        itens: itensVenda
      };        
  };

  it("Atualizar uma venda que não existe deve retornar um AppError.", async () => {
    await expect(vendaUpdateService.execute({ id: venda_id2 + 1, tipo_pagamento: "Dinheiro" })).rejects.toEqual(new AppError("A venda especificada não existe.", 404));    
  });  

  it("Se nenhum campo for imformado, retornar um AppError", async () => {
    await expect(vendaUpdateService.execute({ id: venda_id })).rejects.toEqual(new AppError("Pelo menos um campo a ser alterado deve ser informado."));   
  });

  it("Se algum produto que não existe for informado, retornar um AppError", async () => {
    const itens = [{
      id_produto: id_produto2 + 1,
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
        id_produto,
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
        id_produto,
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
        id_produto,
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
        id_produto,
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
        id_produto: id_produto2,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: (22.22 * 10),
        valor_comissao: 10
      },
      {
        id_produto: id_produto,
        quantidade: 99,
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
  
  
});