import ComprasRepository from "../../repositories/ComprasRepository.js";
import CompraShowService from "./CompraShowService.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import AppError from "../../utils/AppError.js";

describe("CompraShowService", () =>{
  /** @type {ComprasRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository = null;

  /** @type {CompraShowService} */
  let compraShowService = null;  

  let compra_id;

  beforeAll( async() => {
    repository = new ComprasRepository();        
    compraShowService = new CompraShowService(repository); 
    produtosRepository = new ProdutosRepository();

    await repository.deleteAll();
    await produtosRepository.deleteAll();
  });  

  beforeEach( async() => {  
    const produtoTeste = {           
      nome: "Teste",
      descricao: "Produto criado para fins de teste",
      categoria: "T",
      tamanho: 10,
      estoque_atual: 10
    };

    const id_produto = await produtosRepository.create(produtoTeste);

    const compraTeste = {           
      numero_nota: "123456",
      fornecedor: "Teste",
      data_compra: "03/10/2024",
      itens:[{
        id_produto,
        quantidade: 10,
        valor_unitario: 22.22,
        valor_total: 22.22 * 10
      }]
    }

    compra_id = await repository.create(compraTeste);   
  })

  afterEach( async() => {
    await repository.deleteAll(); 
    await produtosRepository.deleteAll();
  });

  afterAll( async () => { 
    await repository.disconnect();
    await produtosRepository.disconnect();
  });

  it('A Compra procurada deve ser retornada.', async () => {
    const compra = await compraShowService.execute({ id: compra_id });
    expect(compra).toBeDefined();
  });

  it('Caso a Compra não exista, retornar um AppError.', async () => {  
    await expect(compraShowService.execute({ id: compra_id + 1 })).rejects.toEqual(new AppError("A Compra especificada não existe.", 404));
  });
  
});