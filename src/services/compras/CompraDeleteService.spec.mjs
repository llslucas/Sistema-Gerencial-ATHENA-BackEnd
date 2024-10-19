import ComprasRepository from "../../repositories/ComprasRepository.js";
import CompraDeleteService from "./CompraDeleteService.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import AppError from "../../utils/AppError.js";
import { produtoTeste } from "../../utils/Examples.js";

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
    const id_produto = await produtosRepository.create(produtoTeste);

    const compraTeste = {           
      numero_nota: "123456",
      fornecedor: "Teste",
      data_compra: "03/10/2024",
      itens:[{
        id: id_produto,
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
    await expect(compraDeleteService.execute({ id: compra_id })).resolves.toBeDefined();;
  });

  it('Caso a Compra não exista, retornar um AppError.', async () => {
    await expect(compraDeleteService.execute({ id: compra_id + 1 })).rejects.toEqual(new AppError("A compra especificada não existe.", 404));
  });
  
});