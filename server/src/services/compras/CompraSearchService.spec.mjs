import ComprasRepository from "../../repositories/ComprasRepository.js";
import CompraSearchService from "./CompraSearchService.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import AppError from "../../utils/AppError.js";

describe("CompraSearchService", () =>{
  /** @type {ComprasRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository = null;

  /** @type {CompraSearchService} */
  let compraSearchService = null;  

  let id_produto1;
  let id_produto2;


  //Função para usar como callback no map, formata a compra obtida na query para ficar igual ao array de cadastro.
  function formatCompra(compra){     
      const itensCompra = compra.itens.map(item => {
        return{
          id_produto: item.id_produto,
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total
        }
      });

      return {
        numero_nota: compra.numero_nota,
        fornecedor: compra.fornecedor,
        data_compra: compra.data_compra,
        itens: itensCompra
      };  
  }

  beforeAll( async() => {
    repository = new ComprasRepository();        
    compraSearchService = new CompraSearchService(repository); 
    produtosRepository = new ProdutosRepository();

    await repository.deleteAll();
    await produtosRepository.deleteAll();
  });  

  beforeEach( async() => {  
    const produtoTeste1 = {           
      nome: "Teste",
      descricao: "Produto criado para fins de teste",
      categoria: "T",
      tamanho: 10,
      estoque_atual: 10
    };

    const produtoTeste2 = {           
      nome: "Produto",
      descricao: "Produto criado para fins de teste",
      categoria: "T",
      tamanho: 20,
      estoque_atual: 20
    };

    id_produto1 = await produtosRepository.create(produtoTeste1);
    id_produto2 = await produtosRepository.create(produtoTeste2);

    const compraTeste1 = {           
      numero_nota: 123456,
      fornecedor: "Teste 1",
      data_compra: "03/10/2024",
      itens:[{
        id_produto: id_produto1,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: (22.22 * 10)
      }]
    };

    const compraTeste2 = {           
      numero_nota: 987654,
      fornecedor: "Teste 2",
      data_compra: "10/10/2024",
      itens:[{
        id_produto: id_produto2,
        quantidade: 5,
        valor_unitario: 22.22,
        valor_total: (22.22 * 10)
      }]
    };

    await repository.create(compraTeste1);
    await repository.create(compraTeste2);
  });

  afterEach( async() => {
    await repository.deleteAll(); 
    await produtosRepository.deleteAll();
  });

  afterAll( async () => { 
    await repository.disconnect();
    await produtosRepository.disconnect();
  });

  it("Uma busca em branco deve retornar todos os compras.", async () => {
    const compras = await compraSearchService.execute({search: ""});

    expect(compras).toHaveLength(2);
  });

  it("Uma busca com o número da nota deve retornar o pedido esperado.", async () => {
    const compras = await compraSearchService.execute({search: "123456"}); 

    const compraProcurada = [{           
      numero_nota: 123456,
      fornecedor: "Teste 1",
      data_compra: "03/10/2024",
      itens:[{
        id_produto: id_produto1,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: (22.22 * 10)
      }]
    }]; 

    const comprasEncontradas = compras.map(formatCompra);
    
    expect(comprasEncontradas).toEqual(compraProcurada);
  });

  it("Uma busca com o fornecedor da nota deve retornar o pedido esperado.", async () => {
    const compras = await compraSearchService.execute({search: "Teste 2"}); 

    const compraProcurada = [{           
      numero_nota: 987654,
      fornecedor: "Teste 2",
      data_compra: "10/10/2024",
      itens:[{
        id_produto: id_produto2,
        quantidade: 5,
        valor_unitario: 22.22,
        valor_total: (22.22 * 10)
      }]
    }];

    const comprasEncontradas = compras.map(formatCompra);
    
    expect(comprasEncontradas).toEqual(compraProcurada);
  });

  it("Uma busca com o produto da nota deve retornar o pedido esperado.", async () => {
    const compras = await compraSearchService.execute({search: "Produto"}); 

    const compraProcurada = [{           
      numero_nota: 987654,
      fornecedor: "Teste 2",
      data_compra: "10/10/2024",
      itens:[{
        id_produto: id_produto2,
        quantidade: 5,
        valor_unitario: 22.22,
        valor_total: (22.22 * 10)
      }]
    }];

    const comprasEncontradas = compras.map(formatCompra);
    
    expect(comprasEncontradas).toEqual(compraProcurada);
  });

  it("Uma busca incorreta deve retornar um array vazio.", async () => {
    const compras = await compraSearchService.execute({search: "Produto 0"}); 

    expect(compras).toHaveLength(0);
  });  
  
});