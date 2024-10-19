import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import ProdutoDeleteService from "./ProdutoDeleteService.js";
import AppError from "../../utils/AppError.js";

describe("ProdutoDeleteService", () =>{
  /** @type {ProdutosRepository} */
  let repository = null;

  /** @type {ProdutoDeleteService} */
  let produtoDeleteService = null;

  /** @type {Number} */
  let produto_id;

  beforeAll( async() => {
    repository = new ProdutosRepository();        
    produtoDeleteService = new ProdutoDeleteService(repository); 
    await repository.deleteAll();
  });  

  beforeEach( async() => {
    const produtoTeste = {           
      nome: "Teste",
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

  it('O Usuário deve ser excluído.', async () => {
    await expect(produtoDeleteService.execute({ id: produto_id })).resolves.not.toEqual(0);
  });

  it('Caso o Produto não exista retornar um AppError.', async () => {
    await expect(produtoDeleteService.execute({ id: produto_id + 1 })).rejects.toEqual(new AppError("O Produto especificado não existe.", 404));
  });
  
});