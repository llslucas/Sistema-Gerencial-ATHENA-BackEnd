import MovimentacoesRepository from "../../repositories/MovimentacoesRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import MovimentacaoShowService from "./MovimentacaoShowService.js";
import { produtoTeste, produtoTeste2 } from "../../utils/Examples.js";
import AppError from "../../utils/AppError.js";

describe("MovimentacaoShowService", () => {
  /** @type {MovimentacoesRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository;

  /** @type {MovimentacaoShowService} */
  let movimentacaoShowService;
  
  let id_produto;
  let id_produto2;
  let id_movimentacao;
  let id_movimentacao2;

  beforeAll(async() => {
    repository = new MovimentacoesRepository();
    movimentacaoShowService = new MovimentacaoShowService(repository);    
    produtosRepository = new ProdutosRepository();

    await repository.deleteAll();    
    await produtosRepository.deleteAll();
  });

  beforeEach(async() => {   
    id_produto = await produtosRepository.create(produtoTeste);    
    id_produto2 = await produtosRepository.create(produtoTeste2);    

    const MovimentacaoTeste = {
      descricao: "Movimentação de Teste",
      data_movimentacao: "13/10/2021",
      itens:[{
        id_produto,
        tipo_movimentacao: "ENTRADA",
        quantidade: 5,
        valor_unitario: 5,
        valor_total: 25
      }]
    };

    const MovimentacaoTeste2 = {
      descricao: "Outro Teste",
      data_movimentacao: "14/10/2021",
      itens:[{
        id_produto: id_produto2,
        tipo_movimentacao: "SAÍDA",
        quantidade: 5,
        valor_unitario: 5,
        valor_total: 25
      }]
    };

    id_movimentacao = await repository.create(MovimentacaoTeste);
    id_movimentacao2 = await repository.create(MovimentacaoTeste2);
  });
  
  afterEach(async() => {
    await repository.deleteAll();    
    await produtosRepository.deleteAll();
  });

  afterAll(async() => {
    await repository.disconnect();    
    await produtosRepository.disconnect();
  });

  it("A Movimentação deve ser retornada.", async() => {
    const pano = await movimentacaoShowService.execute({id: id_movimentacao});
    expect(pano).toBeDefined();
  })

  it("Caso a Movimentação não exista, retornar um AppError.", async() => {    
    await expect(movimentacaoShowService.execute({id: id_movimentacao2 + 1})).rejects.toEqual(
      new AppError("A Movimentação especificada não existe.", 404)
    );
  }); 
  
});