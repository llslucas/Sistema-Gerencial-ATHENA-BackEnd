import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import ProdutoUpdateService from "./ProdutoUpdateService.js";
import AppError from "../../utils/AppError.js";

describe("ProdutoUpdateService", () =>{
  /** @type {ProdutosRepository} */
  let repository = null;

  /** @type {ProdutoUpdateService} */
  let produtoUpdateService = null;

  let produto_id;

  beforeAll( async() => {
    repository = new ProdutosRepository();        
    produtoUpdateService = new ProdutoUpdateService(repository); 
    await repository.deleteAll();
  });  

  beforeEach( async() => {
    const produtoTeste = {           
      nome: "Produto Teste",
      descricao: "Produto criado para fins de teste",
      categoria: "T",
      tamanho: "10",
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

  it("O nome do produto deve ser atualizado.", async() => {
    await produtoUpdateService.execute({ id: produto_id, nome: "Produto Atualizado"});

    const produto = await repository.show({ id: produto_id });

    expect(produto.nome).toBe("Produto Atualizado");
  });

  it("A descrição do produto deve ser atualizada.", async() => {
    await produtoUpdateService.execute({ id: produto_id, descricao: "Nova descrição"});

    const produto = await repository.show({ id: produto_id });

    expect(produto.descricao).toBe("Nova descrição");
  });

  it("A categoria do produto deve ser atualizada.", async() => {
    await produtoUpdateService.execute({ id: produto_id, categoria: "Nova Categoria"});

    const produto = await repository.show({ id: produto_id });

    expect(produto.categoria).toBe("Nova Categoria");
  });

  it("O tamanho do produto deve ser atualizado.", async() => {
    await produtoUpdateService.execute({ id: produto_id, tamanho: "99"});

    const produto = await repository.show({ id: produto_id });

    expect(produto.tamanho).toBe("99");
  });

  it("O estoque atual do produto deve ser atualizado.", async() => {
    await produtoUpdateService.execute({ id: produto_id, estoque_atual: 55});

    const produto = await repository.show({ id: produto_id });

    expect(produto.estoque_atual).toBe(55);
  });

  it("Caso o produto não exista, retornar um AppError", async() => { 
    await expect(produtoUpdateService.execute({ id: produto_id + 1, nome: "Produto Atualizado"}))
      .rejects.toEqual(new AppError("O Produto especificado não existe.", 404));
  });
});