import ComprasRepository from "../../repositories/ComprasRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import CompraCreateService from "./CompraCreateService.js";
import AppError from "../../utils/AppError.js";
import { produtoTeste } from "../../utils/Examples.js";

describe("CompraCreateService", () =>{
  /** @type {ComprasRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository = null;

  /** @type {CompraCreateService} */
  let compraCreateService = null;  

  let id_produto;

  beforeAll( async() => {
    repository = new ComprasRepository();        
    compraCreateService = new CompraCreateService(repository); 
    produtosRepository = new ProdutosRepository();

    await repository.deleteAll();
    await produtosRepository.deleteAll();
  });  

  beforeEach( async() => {  
    id_produto = await produtosRepository.create(produtoTeste);
  })

  afterEach( async() => {
    await repository.deleteAll(); 
    await produtosRepository.deleteAll();
  });

  afterAll( async () => { 
    await repository.disconnect();
    await produtosRepository.disconnect();
  });

  it("A compra deve ser criada.", async () => {    
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
    }
    const compra_id = await compraCreateService.execute(compraTeste);   
    expect(compra_id).toBeDefined();    
  });  

  it("Caso o campo numero_nota esteja em branco deve retornar um AppError.", async() => {
    const compraTeste = { 
      fornecedor: "Teste",
      data_compra: "03/10/2024",
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10
      }]
    }

    await expect(compraCreateService.execute(compraTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas.", 400));
  });

  it("Caso o campo fornecedor esteja em branco deve retornar um AppError.", async() => {
    const compraTeste = {           
      numero_nota: 123456,
      data_compra: "03/10/2024",
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10
      }]
    }

    await expect(compraCreateService.execute(compraTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas.", 400));
  });

  it("Caso o campo data_compra esteja em branco deve retornar um AppError.", async() => {
    const compraTeste = {           
      numero_nota: 123456,
      fornecedor: "Teste",
      itens:[{
        id: id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10
      }]
    }

    await expect(compraCreateService.execute(compraTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas.", 400));
  });

  it("Caso a compra não possua itens, retornar um AppError.", async() => {
    const compraTeste = {           
      numero_nota: 123456,
      fornecedor: "Teste",
      data_compra: "03/10/2024"      
    }

    await expect(compraCreateService.execute(compraTeste)).rejects.toEqual(new AppError("Não é possível cadastrar uma compra sem itens.", 400));
  });

  it("Caso a compra possua um item que não existe, retornar um AppError.", async() => {
    const compraTeste = {           
      numero_nota: 123456,
      fornecedor: "Teste",
      data_compra: "03/10/2024",
      itens:[{
        id: id_produto + 1,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10
      }]
    }

    await expect(compraCreateService.execute(compraTeste)).rejects.toEqual(new AppError(`O Produto com o ID: ${id_produto + 1} não existe.`, 404));
  });

  it("Caso a o número da nota já exista, retornar um AppError.", async() => {
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
    }

    const compraTeste2 = {           
      numero_nota: 123456,
      fornecedor: "Teste2",
      data_compra: "04/10/2024",
      itens:[{
        id: id_produto,
        quantidade: 20,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10
      }]
    }

    await compraCreateService.execute(compraTeste)

    await expect(compraCreateService.execute(compraTeste2)).rejects.toEqual(new AppError("Já existe uma nota com este número cadastrada.", 404));
  });
});