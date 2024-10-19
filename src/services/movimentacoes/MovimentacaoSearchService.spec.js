import MovimentacoesRepository from "../../repositories/MovimentacoesRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import MovimentacaoSearchService from "./MovimentacaoSearchService.js";
import { produtoTeste, produtoTeste2 } from "../../utils/Examples.js";
import { FormatMovimentacao } from "../../utils/Format.js";

describe("MovimentacaoSearchService", () => {
  /** @type {MovimentacoesRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository;

  /** @type {MovimentacaoSearchService} */
  let movimentacaoSearchService;
  
  let id_produto;
  let id_produto2;
  let id_movimentacao;
  let id_movimentacao2;

  beforeAll(async() => {
    repository = new MovimentacoesRepository();
    movimentacaoSearchService = new MovimentacaoSearchService(repository);    
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
        id: id_produto,
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
        id: id_produto2,
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

  it("Uma busca em branco deve retornar todas as movimentações.", async() => {
    const movimentacoes = await movimentacaoSearchService.execute({});
    expect(movimentacoes).toHaveLength(4);
  });

  it("Uma busca pelo ID deve retornar a movimentação esperada.", async() => {
    const movimentacoes = await movimentacaoSearchService.execute({search: id_movimentacao});

    const movimentacaoEsperada = [{
      descricao: "Movimentação de Teste",
      data_movimentacao: "13/10/2021",
      itens:[{
        id: id_produto,
        tipo_movimentacao: "ENTRADA",
        quantidade: 5,
        valor_unitario: 5,
        valor_total: 25
      }]
    }];

    const movimentacoesRecebidas = movimentacoes.map(FormatMovimentacao);

    expect(movimentacoesRecebidas).toEqual(movimentacaoEsperada);
  });

  it("Uma busca pela descrição deve retornar a movimentação esperada.", async() => {
    const movimentacoes = await movimentacaoSearchService.execute({search: "Movimentação de Teste"});

    const movimentacaoEsperada = [{
      descricao: "Movimentação de Teste",
      data_movimentacao: "13/10/2021",
      itens:[{
        id: id_produto,
        tipo_movimentacao: "ENTRADA",
        quantidade: 5,
        valor_unitario: 5,
        valor_total: 25
      }]
    }];

    const movimentacoesRecebidas = movimentacoes.map(FormatMovimentacao);

    expect(movimentacoesRecebidas).toEqual(movimentacaoEsperada);
  });  

  it("Uma busca pelo nome do produto deve retornar a movimentação esperada.", async() => {
    const movimentacoes = await movimentacaoSearchService.execute({search: "Produto Teste"});

    const movimentacaoEsperada = [{
      descricao: "Movimentação de Teste",
      data_movimentacao: "13/10/2021",
      itens:[{
        id: id_produto,
        tipo_movimentacao: "ENTRADA",
        quantidade: 5,
        valor_unitario: 5,
        valor_total: 25
      }]
    }];

    const movimentacoesRecebidas = movimentacoes.map(FormatMovimentacao);
    const movimentacoesFiltradas = movimentacoesRecebidas.filter(mov => mov.descricao !== "Saldo Inicial");

    expect(movimentacoesFiltradas).toEqual(movimentacaoEsperada);
  }); 

  it("Uma busca incorreta deve retornar um array vazio.", async () => {
    const movimentacoes = await movimentacaoSearchService.execute({search: "Movimentação Inexistente"}); 

    expect(movimentacoes).toHaveLength(0);
  }); 
  
});