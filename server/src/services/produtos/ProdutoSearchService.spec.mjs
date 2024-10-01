import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import ProdutoSearchService from "./ProdutoSearchService.js";
import AppError from "../../utils/AppError.js";

describe("ProdutoSearchService", () =>{
  /** @type {ProdutosRepository} */
  let repository = null;

  /** @type {ProdutoSearchService} */
  let produtoSearchService = null;

  beforeAll( async() => {
    repository = new ProdutosRepository();        
    produtoSearchService = new ProdutoSearchService(repository); 
    await repository.deleteAll();
  });  

  beforeEach( async() => {
    const produtoTeste1 = {           
      nome: "Produto Teste",
      descricao: "Produto criado para fins de teste",
      categoria: "T",
      tamanho: 10,
      estoque_atual: 10
    }

    const produtoTeste2 = {           
      nome: "Brinco de Ouro",
      descricao: "Segundo produto criado apra fins de teste",
      categoria: "B",
      tamanho: "10",
      estoque_atual: 10
    }

    await repository.create(produtoTeste1);    
    await repository.create(produtoTeste2);    
  });

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async () => { 
    await repository.disconnect();
  });


  it("Uma busca em branco deve retornar todos os clientes.", async () => {
    const clientes = await produtoSearchService.execute({search: ""});

    expect(clientes).toHaveLength(2);
  });

  it("Uma busca com valores em comum deve retornar todos os produtos com o valor.", async () => {
    const clientes = await produtoSearchService.execute({search: "teste"});

    expect(clientes).toHaveLength(2);
  });

  it("A busca deve retornar o produto esperado.", async () => {
    const [produto] = await produtoSearchService.execute({search: "Produto Teste"});

    const produtoEsperado = {           
      nome: "Produto Teste",
      descricao: "Produto criado para fins de teste",
      categoria: "T",
      tamanho: "10",
      estoque_atual: 10      
    }

    produtoEsperado.id = produto.id;
    produtoEsperado.created_at = produto.created_at;
    produtoEsperado.updated_at = produto.updated_at;

    expect(produto).toEqual(produtoEsperado);
  }); 
});