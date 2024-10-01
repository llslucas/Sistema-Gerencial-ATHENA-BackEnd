import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import ProdutoCreateService from "./ProdutoCreateService.js";
import AppError from "../../utils/AppError.js";

describe("ProdutoCreateService", () =>{
  /** @type {ProdutosRepository} */
  let repository = null;

  /** @type {ProdutoCreateService} */
  let produtoCreateService = null;

  beforeAll( async() => {
    repository = new ProdutosRepository();        
    produtoCreateService = new ProdutoCreateService(repository); 
    await repository.deleteAll();
  });  

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async () => { 
    await repository.disconnect();
  });

  it("O produto deve ser criado.", async () => {
    const produtoTeste = {           
      nome: "Teste",
      descricao: "Produto criado para fins de teste",
      categoria: "T",
      tamanho: 10,
      estoque_atual: 10
    }

    const cliente_id = await produtoCreateService.execute(produtoTeste);    
    expect(cliente_id).toBeDefined();    
  });  

  it("Caso o campo nome esteja em branco deve retornar um AppError.", async() => {
    const produtoTeste = {     
      descricao: "Produto criado para fins de teste",
      categoria: "T",
      tamanho: 10,
      estoque_atual: 10    
    }

    await expect(produtoCreateService.execute(produtoTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas."));
  });

  it("Caso o campo descricao esteja em branco deve retornar um AppError.", async() => {
    const produtoTeste = {  
      nome: "Teste",    
      categoria: "T",
      tamanho: 10,
      estoque_atual: 10   
    }

    await expect(produtoCreateService.execute(produtoTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas."));
  });

  it("Caso o campo categoria esteja em branco deve retornar um AppError.", async() => {
    const produtoTeste = {
      nome: "Teste",
      descricao: "Produto criado para fins de teste",      
      tamanho: 10,
      estoque_atual: 10  
    }

    await expect(produtoCreateService.execute(produtoTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas."));
  });

  it("Caso o campo tamanho esteja em branco deve retornar um AppError.", async() => {
    const produtoTeste = {
      nome: "Teste",
      descricao: "Produto criado para fins de teste",
      categoria: "T",    
      estoque_atual: 10
    }

    await expect(produtoCreateService.execute(produtoTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas."));
  });

  it("Caso o campo estoque_atual esteja em branco deve retornar um AppError.", async() => {
    const produtoTeste = {
      nome: "Teste",
      descricao: "Produto criado para fins de teste",
      categoria: "T",
      tamanho: 10    
    }

    await expect(produtoCreateService.execute(produtoTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas."));
  });

});