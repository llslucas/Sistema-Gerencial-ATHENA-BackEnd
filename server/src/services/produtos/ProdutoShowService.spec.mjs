import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import ProdutoShowService from "./ProdutoShowService.js";
import AppError from "../../utils/AppError.js";

describe("ProdutoShowService", () =>{
  /** @type {ProdutosRepository} */
  let repository = null;

  /** @type {ProdutoShowService} */
  let produtoShowService = null;

  let produto_id;

  beforeAll( async() => {
    repository = new ProdutosRepository();        
    produtoShowService = new ProdutoShowService(repository); 
    await repository.deleteAll();
  });  

  beforeEach( async() => {
    const produtoTeste = {           
      nome: "Produto Teste",
      descricao: "Produto criado para fins de teste",
      categoria: "T",
      tamanho: 10,
      estoque_atual: 10
    }

    produto_id = await repository.create(produtoTeste);  
  });

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async () => { 
    await repository.disconnect();
  });

  it("O Produto deve ser retornado.", async () => {
    const cliente = await produtoShowService.execute({ id: produto_id });

    expect(cliente).toBeDefined();
  });

  it("Caso o produto não exista deve retornar um AppError.", async () => {
    await expect(produtoShowService.execute({ id: produto_id + 1 })).rejects.toEqual(new AppError("O Produto especificado não existe.", 404));   
  });
  
});