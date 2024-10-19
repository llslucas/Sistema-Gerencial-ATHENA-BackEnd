import MovimentacoesRepository from "../../repositories/MovimentacoesRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import MovimentacaoUpdateService from "./MovimentacaoUpdateService.js";
import { produtoTeste, produtoTeste2 } from "../../utils/Examples.js";
import { FormatMovimentacao } from "../../utils/Format.js";
import AppError from "../../utils/AppError.js";
import EstoqueRepository from "../../repositories/EstoqueRepository.js";
import AtualizaEstoqueService from "../estoque/AtualizaEstoqueService.js";

describe("MovimentacaoUpdateService", () => {
  /** @type {MovimentacoesRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository;

  /** @type {MovimentacaoUpdateService} */
  let movimentacaoUpdateService;

  /** @type {EstoqueRepository} */
  let estoqueRepository

  /** @type {AtualizaEstoqueService} */
  let atualizaEstoqueService
  
  let id_produto;
  let id_produto2;
  let id_movimentacao;

  beforeAll(async() => {
    repository = new MovimentacoesRepository();
    movimentacaoUpdateService = new MovimentacaoUpdateService(repository);    
    produtosRepository = new ProdutosRepository();
    estoqueRepository = new EstoqueRepository();    
    atualizaEstoqueService = new AtualizaEstoqueService({ estoqueRepository, produtosRepository});

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
        id: id_produto,
        tipo_movimentacao: "ENTRADA",
        quantidade: 5,
        valor_unitario: 5,
        valor_total: 25
      }]
    };    

    id_movimentacao = await repository.create(MovimentacaoTeste);
    atualizaEstoqueService.execute({id_produto});
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
      id: id_produto2 + 1,
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
        id: id_produto,
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
        id: id_produto,
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
        id: id_produto2,
        tipo_movimentacao: "ENTRADA",
        quantidade: 5,
        valor_unitario: 5,
        valor_total: 25
      },
      {
        id: id_produto,
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

  it("Caso o a movimentação seja de Saída e a quantidade for maior que o estoque retornar um AppError", async() => {
    const novosItens = [      
      {
        id: id_produto,
        tipo_movimentacao: "SAÍDA",
        quantidade: 20,
        valor_unitario: 5,
        valor_total: 25
      }
    ]     

    await expect(movimentacaoUpdateService.execute({ id: id_movimentacao, itens: novosItens })).rejects.toEqual(
      new AppError(
        `Não há saldo sufuciente do produto ${produtoTeste.nome} para realizar a venda. \n Saldo atual: ${10} \n Saldo Necessário: ${25}`
      )
    );
  }); 
  
});