import PanosRepository from "../../repositories/PanosRepository.js";
import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import PanoDeleteService from "./PanoDeleteService.js";
import AppError from "../../utils/AppError.js";
import { produtoTeste } from "../../utils/Examples.js";
import { revendedorTeste } from "../../utils/Examples.js";

describe("PanoDeleteService", () => {
  /** @type {PanosRepository} */
  let repository = null;

  /** @type {RevendedoresRepository} */
  let revendedoresRepository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository;

  /** @type {PanoDeleteService} */
  let panoDeleteService;

  let id_revendedor;
  let id_produto;
  let id_pano;

  beforeAll(async() => {
    repository = new PanosRepository();
    panoDeleteService = new PanoDeleteService(repository);
    revendedoresRepository = new RevendedoresRepository();
    produtosRepository = new ProdutosRepository();

    await repository.deleteAll();
    await revendedoresRepository.deleteAll();
    await produtosRepository.deleteAll();
  });

  beforeEach(async() => {  
    id_produto = await produtosRepository.create(produtoTeste);
    id_revendedor = await revendedoresRepository.create(revendedorTeste);

    const panoTeste = {
      observacoes: "Pano criado para fins de teste",
      id_revendedor,
      itens:[{
        id_produto,
        quantidade: 5,
        valor_venda: 20
      }]
    };

    id_pano = await repository.create(panoTeste);
  });
  
  afterEach(async() => {
    await repository.deleteAll();
    await revendedoresRepository.deleteAll();
    await produtosRepository.deleteAll();
  });

  afterAll(async() => {
    await repository.disconnect();
    await revendedoresRepository.disconnect();
    await produtosRepository.disconnect();
  });

  it("O Pano deve ser excluído.", async() => {
    await expect(panoDeleteService.execute({ id: id_pano }))
            .resolves.not.toEqual(0);
  });

  it("Caso o Pano não exista, retornar um AppError.", async() => {
    await expect(panoDeleteService.execute({ id: id_pano + 1 }))
            .rejects.toEqual(
              new AppError("O pano especificado não existe.", 404)
            )
  });
 
  
});