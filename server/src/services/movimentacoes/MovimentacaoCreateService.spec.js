import MovimentacoesRepository from "../../repositories/MovimentacoesRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import MovimentacaoCreateService from "./MovimentacaoCreateService.js";
import AppError from "../../utils/AppError.js";
import { produtoTeste } from "../../utils/Examples.js";

describe("MovimentacaoCreateService", () => {
  /** @type {MovimentacoesRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository;

  /** @type {MovimentacaoCreateService} */
  let movimentacaoCreateService;
  
  let id_produto;

  beforeAll(async() => {
    repository = new MovimentacoesRepository();
    movimentacaoCreateService = new MovimentacaoCreateService(repository);    
    produtosRepository = new ProdutosRepository();

    await repository.deleteAll();    
    await produtosRepository.deleteAll();
  });

  beforeEach(async() => {   
    id_produto = await produtosRepository.create(produtoTeste);    
  });
  
  afterEach(async() => {
    await repository.deleteAll();    
    await produtosRepository.deleteAll();
  });

  afterAll(async() => {
    await repository.disconnect();    
    await produtosRepository.disconnect();
  });

  it("A Movimentação deve ser criada.", async() => {
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

    const movientacao_id = await movimentacaoCreateService.execute(MovimentacaoTeste);

    expect(movientacao_id).toBeDefined();
  });
  
  it("Caso o campo Descrição esteja em branco, retornar um AppError.", async() => {
    const MovimentacaoTeste = {
      descricao: null,
      data_movimentacao: "13/10/2021",
      itens:[{
        id_produto,
        tipo_movimentacao: "ENTRADA",
        quantidade: 5,
        valor_unitario: 5,
        valor_total: 25
      }]
    };

    await expect(movimentacaoCreateService.execute(MovimentacaoTeste)).rejects.toEqual(
      new AppError("Todos os campos de cadastro devem estar preenchidos.")
    );
  });

  it("Caso o campo data_movimentacao esteja em branco, retornar um AppError.", async() => {
    const MovimentacaoTeste = {
      descricao: "Movimentação de Teste",
      data_movimentacao: null,
      itens:[{
        id_produto,
        tipo_movimentacao: "ENTRADA",
        quantidade: 5,
        valor_unitario: 5,
        valor_total: 25
      }]
    };

    await expect(movimentacaoCreateService.execute(MovimentacaoTeste)).rejects.toEqual(
      new AppError("Todos os campos de cadastro devem estar preenchidos.")
    );
  });

  it("Caso o campo itens esteja nulo, retornar um AppError.", async() => {
    const MovimentacaoTeste = {
      descricao: "Movimentação de Teste",
      data_movimentacao: "13/10/2021",
      itens: null
    };

    await expect(movimentacaoCreateService.execute(MovimentacaoTeste)).rejects.toEqual(
      new AppError("A Movimentação deve conter ao menos um item.")
    );
  });

  it("Caso o campo itens esteja vazio, retornar um AppError.", async() => {
    const MovimentacaoTeste = {
      descricao: "Movimentação de Teste",
      data_movimentacao: "13/10/2021",
      itens: []
    };

    await expect(movimentacaoCreateService.execute(MovimentacaoTeste)).rejects.toEqual(
      new AppError("A Movimentação deve conter ao menos um item.")
    );
  });

  it("Caso o Produto não exista, retornar um AppError.", async() => {
    const MovimentacaoTeste = {
      descricao: "Movimentação de Teste",
      data_movimentacao: "13/10/2021",
      itens:[{
        id_produto: id_produto + 1,
        tipo_movimentacao: "ENTRADA",
        quantidade: 5,
        valor_unitario: 5,
        valor_total: 25
      }]
    };

    await expect(movimentacaoCreateService.execute(MovimentacaoTeste)).rejects.toEqual(
      new AppError(`O Produto com o ID: ${ id_produto + 1 } não existe.`, 404)
    );
  });  
});