import MovimentacoesRepository from "../../repositories/MovimentacoesRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import MovimentacaoDeleteService from "./MovimentacaoDeleteService.js";
import AppError from "../../utils/AppError.js";
import { produtoTeste } from "../../utils/Examples.js";

describe("MovimentacaoDeleteService", () => {
  /** @type {MovimentacoesRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository;

  /** @type {MovimentacaoDeleteService} */
  let movimentacaoDeleteService;
  
  let id_produto;
  let id_movimentacao;

  beforeAll(async() => {
    repository = new MovimentacoesRepository();
    movimentacaoDeleteService = new MovimentacaoDeleteService(repository);    
    produtosRepository = new ProdutosRepository();

    await repository.deleteAll();    
    await produtosRepository.deleteAll();
  });

  beforeEach(async() => {   
    id_produto = await produtosRepository.create(produtoTeste);    

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

    id_movimentacao = await repository.create(MovimentacaoTeste);
  });
  
  afterEach(async() => {
    await repository.deleteAll();    
    await produtosRepository.deleteAll();
  });

  afterAll(async() => {
    await repository.disconnect();    
    await produtosRepository.disconnect();
  });

  it("A Movimentação deve ser excluída.", async() => {
    await expect(movimentacaoDeleteService.execute({ id: id_movimentacao })).resolves.not.toEqual(0);
  });

  it("Caso a Movimentação não exista, retornar um AppError.", async() => {
    await expect(movimentacaoDeleteService.execute({ id: id_movimentacao + 1 })).rejects.toEqual(
      new AppError("A Movimentação especificada não existe.", 404)
    );
  });
  
});