import ComprasRepository from "../../repositories/ComprasRepository.js";
import CompraUpdateService from "./CompraUpdateService.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import AppError from "../../utils/AppError.js";
import { produtoTeste } from "../../utils/Examples.js";
import { formatCompra } from "../../utils/Format.js";

describe("CompraUpdateService", () =>{
  /** @type {ComprasRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository = null;

  /** @type {CompraUpdateService} */
  let compraUpdateService = null;  

  let id_produto;
  let id_compra; 

  beforeAll( async() => {
    repository = new ComprasRepository();        
    compraUpdateService = new CompraUpdateService(repository); 
    produtosRepository = new ProdutosRepository();

    await repository.deleteAll();
    await produtosRepository.deleteAll();
  });  

  beforeEach( async() => {  
    id_produto = await produtosRepository.create(produtoTeste);

    const compraTeste = {           
      numero_nota: 123456,
      fornecedor: "Fornecedor Teste",
      data_compra: "03/10/2024",
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: (22.22 * 10)
      }]
    };

    id_compra = await repository.create(compraTeste);
  });

  afterEach( async() => {
    await repository.deleteAll(); 
    await produtosRepository.deleteAll();
  });

  afterAll( async () => { 
    await repository.disconnect();
    await produtosRepository.disconnect();
  });

  it("Atualizar uma compra que não existe deve retornar um AppError.", async () => {
    await expect(compraUpdateService.execute({ id: id_compra + 1, numero_nota: 1234567 })).rejects.toEqual(new AppError("A compra especificada não existe.", 404));    
  });  

  it("Se nenhum campo for imformado, retornar um AppError", async () => {
    await expect(compraUpdateService.execute({ id: id_compra })).rejects.toEqual(new AppError("Pelo menos um campo a ser alterado deve ser informado"));   
  });

  it("Se algum produto que não existe for informado, retornar um AppError", async () => {
    const itens = [{
      id: id_produto + 1,
      quantidade: 10,
      valor_unitario: 22.22,
      valor_total: (22.22 * 10)
    }];

    await expect(compraUpdateService.execute({ id: id_compra, itens })).rejects.toEqual(new AppError(`O Produto com o ID: ${id_produto + 1} não existe.`, 404));   
  });

  it("O Número da nota deve ser atualizado.", async() => {
    await compraUpdateService.execute({ id: id_compra, numero_nota: 1234567 });

    const CompraEsperada = {           
      numero_nota: 1234567,
      fornecedor: "Fornecedor Teste",
      data_compra: "03/10/2024",
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: (22.22 * 10)
      }]
    };

    const compraAlterada = formatCompra(await repository.show({ id: id_compra }));

    expect(compraAlterada).toEqual(CompraEsperada);
  });

  it("O Fornecedor deve ser atualizado.", async() => {
    await compraUpdateService.execute({ id: id_compra, fornecedor: "Novo Fornecedor" });

    const CompraEsperada = {           
      numero_nota: 123456,
      fornecedor: "Novo Fornecedor",
      data_compra: "03/10/2024",
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: (22.22 * 10)
      }]
    };

    const compraAlterada = formatCompra(await repository.show({ id: id_compra }));

    expect(compraAlterada).toEqual(CompraEsperada);
  });

  it("A data da compra deve ser atualizada.", async() => {
    await compraUpdateService.execute({ id: id_compra, data_compra: "10/10/2024" });

    const CompraEsperada = {           
      numero_nota: 123456,
      fornecedor: "Fornecedor Teste",
      data_compra: "10/10/2024",
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: (22.22 * 10)
      }]
    };

    const compraAlterada = formatCompra(await repository.show({ id: id_compra }));

    expect(compraAlterada).toEqual(CompraEsperada);
  });

  it("Os itens da compra devem ser atualizados.", async() => {
    const novoProduto = {           
      nome: "Novo Produto",
      descricao: "Produto criado para fins de teste",
      categoria: "T",
      tamanho: 10,
      estoque_atual: 10
    }; 

    const id_produto_novo = await produtosRepository.create(novoProduto);

    const itens = [{
        id: id_produto_novo,
        quantidade: 99,
        valor_unitario: 33,
        valor_total: (33 * 10)
      },
      {
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: (22.22 * 10)
      }      
    ];    

    await compraUpdateService.execute({ id: id_compra, itens });

    const CompraEsperada = {           
      numero_nota: 123456,
      fornecedor: "Fornecedor Teste",
      data_compra: "03/10/2024",
      itens
    };

    const compraAlterada = formatCompra(await repository.show({ id: id_compra }));    

    expect(compraAlterada).toEqual(CompraEsperada);
  });


});