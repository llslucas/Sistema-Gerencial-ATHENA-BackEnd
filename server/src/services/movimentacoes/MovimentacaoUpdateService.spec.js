import MovimentacoesRepository from "../../repositories/MovimentacoesRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import MovimentacaoUpdateService from "./MovimentacaoUpdateService.js";
import { produtoTeste, produtoTeste2 } from "../../utils/Examples.js";
import { FormatMovimentacao } from "../../utils/Format.js";
import AppError from "../../utils/AppError.js";

describe("MovimentacaoUpdateService", () => {
  /** @type {MovimentacoesRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository;

  /** @type {MovimentacaoUpdateService} */
  let movimentacaoUpdateService;
  
  let id_produto;
  let id_produto2;
  let id_movimentacao;

  beforeAll(async() => {
    repository = new MovimentacoesRepository();
    movimentacaoUpdateService = new MovimentacaoUpdateService(repository);    
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

  it("Atualizar uma Movimentação que não existe deve retornar um AppError.", async() => {    
    await expect(movimentacaoUpdateService.execute({ id: id_movimentacao + 1, observacoes: "Teste" })).rejects.toEqual(
      new AppError("A Movimentação especificada não existe.", 404)
    );
  });

  it("Se nenhum campo for mencionado, retornar um AppError.", async() => {    
    await expect(movimentacaoUpdateService.execute({ id: id_movimentacao })).rejects.toEqual(
      new AppError("Pelo menos um campo a ser alterado deve ser informado.")
    );
  });

  it("Se um produto que não existe for informado, retornar um AppError", async() => {
    const itens = [{
      id_produto: id_produto2 + 1,
      tipo_movimentacao: "ENTRADA",
      quantidade: 5,
      valor_unitario: 5,
      valor_total: 25
    }];

    await expect(movimentacaoUpdateService.execute({ id: id_movimentacao, itens})).rejects.toEqual(
      new AppError(`O Produto com o ID: ${ id_produto2 + 1 } não existe.`, 404)
    );
  });  

  it("A Descrição deve ser alterada.", async() => {
    await movimentacaoUpdateService.execute({ id: id_movimentacao, descricao: "Nova Descrição" });

    const MovimentacaoEsperada = {
      descricao: "Nova Descrição",
      data_movimentacao: "13/10/2021",
      itens:[{
        id_produto,
        tipo_movimentacao: "ENTRADA",
        quantidade: 5,
        valor_unitario: 5,
        valor_total: 25
      }]
    }; 

    const MovimentacaoAlterada = FormatMovimentacao(await repository.show({ id: id_movimentacao }));

    expect(MovimentacaoAlterada).toEqual(MovimentacaoEsperada);
  });  

  it("A Data da Movimentação deve ser alterada.", async() => {
    await movimentacaoUpdateService.execute({ id: id_movimentacao, data_movimentacao: "20/10/2021" });

    const MovimentacaoEsperada = {
      descricao: "Movimentação de Teste",
      data_movimentacao: "20/10/2021",
      itens:[{
        id_produto,
        tipo_movimentacao: "ENTRADA",
        quantidade: 5,
        valor_unitario: 5,
        valor_total: 25
      }]
    }; 

    const MovimentacaoAlterada = FormatMovimentacao(await repository.show({ id: id_movimentacao }));

    expect(MovimentacaoAlterada).toEqual(MovimentacaoEsperada);
  });    

  it("Os itens devem ser alterados.", async() => {
    const novosItens = [
      {
        id_produto: id_produto2,
        tipo_movimentacao: "ENTRADA",
        quantidade: 5,
        valor_unitario: 5,
        valor_total: 25
      },
      {
        id_produto,
        tipo_movimentacao: "ENTRADA",
        quantidade: 5,
        valor_unitario: 5,
        valor_total: 25
      }
    ]

    await movimentacaoUpdateService.execute({ id: id_movimentacao, itens: novosItens });

    const MovimentacaoEsperada = {
      descricao: "Movimentação de Teste",
      data_movimentacao: "13/10/2021",
      itens: novosItens
    }; 

    const MovimentacaoAlterada = FormatMovimentacao(await repository.show({ id: id_movimentacao }));

    expect(MovimentacaoAlterada).toEqual(MovimentacaoEsperada);
  }); 
  
});