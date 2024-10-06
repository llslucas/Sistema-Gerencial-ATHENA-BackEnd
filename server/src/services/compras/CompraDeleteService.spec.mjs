import ComprasRepository from "../../repositories/ComprasRepository.js";
import CompraDeleteService from "./CompraDeleteService.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import AppError from "../../utils/AppError.js";

describe("CompraDeleteService", () =>{
  /** @type {ComprasRepository} */
  let repository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository = null;

  /** @type {CompraDeleteService} */
  let compraDeleteService = null;  

  let compra_id;

  beforeAll( async() => {
    repository = new ComprasRepository();        
    compraDeleteService = new CompraDeleteService(repository); 
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

  it('A Compra deve ser excluída.', async () => {
    await expect(compraDeleteService.execute({ id: compra_id })).resolves.not.toEqual(0);
  });

  it('Caso a Compra não exista, retornar um AppError.', async () => {
    await expect(compraDeleteService.execute({ id: compra_id + 1 })).rejects.toEqual(new AppError("A compra especificada não existe.", 404));
  });
  
});