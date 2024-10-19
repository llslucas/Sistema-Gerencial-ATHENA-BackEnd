import EstoqueRepository from "../../repositories/EstoqueRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import ClientesRepository from "../../repositories/ClientesRepository.js";
import ComprasRepository from "../../repositories/ComprasRepository.js";
import VendasRepository from "../../repositories/VendasRepository.js";
import MovimentacoesRepository from "../../repositories/MovimentacoesRepository.js";
import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import AtualizaEstoqueService from "./AtualizaEstoqueService.js";
import { produtoTeste } from "../../utils/Examples.js";
import { revendedorTeste } from "../../utils/Examples.js";
import { clienteTeste } from "../../utils/Examples.js";

describe("AtualizaEstoqueService", () => {
  /** @type EstoqueRepository */
  let estoqueRepository = null;

  /** @type AtualizaEstoqueService */
  let atualizaEstoqueService = null;

  /** @type ProdutosRepository */
  let produtosRepository = null;

  /** @type ClientesRepository */
  let clientesRepository = null;

  /** @type RevendedoresRepository */
  let revendedoresRepository = null;

  /** @type ComprasRepository */
  let comprasRepository = null;

  /** @type VendasRepository */
  let vendasRepository = null;

  /** @type MovimentacoesRepository */
  let movimentacoesRepository = null;

  let id_produto;
  let id_revendedor;
  let id_cliente;

  beforeAll(async() => {
    estoqueRepository = new EstoqueRepository();  
    produtosRepository = new ProdutosRepository();
    clientesRepository  = new ClientesRepository();
    revendedoresRepository = new RevendedoresRepository();
    comprasRepository = new ComprasRepository();
    vendasRepository = new VendasRepository();
    movimentacoesRepository = new MovimentacoesRepository();  

    atualizaEstoqueService = new AtualizaEstoqueService({ estoqueRepository, produtosRepository });
  });

  beforeEach(async() => {
    //Criação do produto teste com estoque 10.
    id_produto = await produtosRepository.create(produtoTeste);
    id_revendedor = await revendedoresRepository.create(revendedorTeste);
    id_cliente = await clientesRepository.create(clienteTeste);
  });

  afterEach(async() => {    
    await comprasRepository.deleteAll();
    await vendasRepository.deleteAll();
    await movimentacoesRepository.deleteAll();
    await produtosRepository.deleteAll();
    await revendedoresRepository.deleteAll();
  });

  afterAll(async() => {
    await produtosRepository.disconnect();
    await revendedoresRepository.disconnect();
    await comprasRepository.disconnect();
    await vendasRepository.disconnect();
    await movimentacoesRepository.disconnect();
  });

  it("O Estoque do produto deve ser igual ao seu saldo inicial.", async() => {
    const produto = await atualizaEstoqueService.execute({ id_produto });
    
    expect(produto.estoque_atual).toBe(10);
  });

  it("Uma venda deve reduzir o estoque atual do produto.", async() => {
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

    const id_venda = await vendasRepository.create(vendaTeste);

    const produto = await atualizaEstoqueService.execute({ id_produto });    
    
    expect(produto.estoque_atual).toBe(0);
  });

  it("Uma Compra deve aumentar o estoque atual do produto.", async() => {
    const compraTeste = {           
      numero_nota: 123456,
      fornecedor: "Teste",
      data_compra: "03/10/2024",
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10
      }]
    };

    const id_compra = await comprasRepository.create(compraTeste);

    const produto = await atualizaEstoqueService.execute({ id_produto });  

    expect(produto.estoque_atual).toBe(20);
  });

  it("A Função deve retornar um produto com o estoque atualizado.", async() => {
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

    await vendasRepository.create(vendaTeste);

    const compraTeste = {           
      numero_nota: 123456,
      fornecedor: "Teste",
      data_compra: "03/10/2024",
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10
      }]
    };

    await comprasRepository.create(compraTeste);

    const produto = await atualizaEstoqueService.execute({ id_produto });  

    const produtoDB = await produtosRepository.show({id: id_produto});

    expect(produto).toEqual(produtoDB);
  });
  
});
