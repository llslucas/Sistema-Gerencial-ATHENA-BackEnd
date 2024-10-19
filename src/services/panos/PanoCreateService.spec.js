import PanosRepository from "../../repositories/PanosRepository.js";
import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import PanoCreateService from "./PanoCreateService.js";
import AppError from "../../utils/AppError.js";
import { produtoTeste } from "../../utils/Examples.js";
import { revendedorTeste } from "../../utils/Examples.js";

describe("PanoCreateService", () => {
  /** @type {PanosRepository} */
  let repository = null;

  /** @type {RevendedoresRepository} */
  let revendedoresRepository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository;

  /** @type {PanoCreateService} */
  let panoCreateService;

  let id_revendedor;
  let id_produto;

  beforeAll(async() => {
    repository = new PanosRepository();
    panoCreateService = new PanoCreateService(repository);
    revendedoresRepository = new RevendedoresRepository();
    produtosRepository = new ProdutosRepository();

    await repository.deleteAll();
    await revendedoresRepository.deleteAll();
    await produtosRepository.deleteAll();
  });

  beforeEach(async() => {   
    id_produto = await produtosRepository.create(produtoTeste);
    id_revendedor = await revendedoresRepository.create(revendedorTeste);
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

  it("O Pano deve ser criado.", async() => {
    const panoTeste = {
      observacoes: "Pano criado para fins de teste",
      id_revendedor,
      itens:[{
        id_produto,
        quantidade: 5,
        valor_venda: 20
      }]
    };

    const pano_id = await panoCreateService.execute(panoTeste);

    expect(pano_id).toBeDefined();
  });
  
  it("Caso o campo observações esteja em branco, retornar um AppError.", async() => {
    const panoTeste = {
      observacoes: null,
      id_revendedor,
      itens:[{
        id_produto,
        quantidade: 5,
        valor_venda: 20
      }]
    };

    await expect(panoCreateService.execute(panoTeste)).rejects.toEqual(
      new AppError("Todos os campos de cadastro devem estar preenchidos.")
    );
  });

  it("Caso o campo id_revendedor esteja em branco, retornar um AppError.", async() => {
    const panoTeste = {
      observacoes: "Pano criado para fins de teste",
      id_revendedor: null,
      itens:[{
        id_produto,
        quantidade: 5,
        valor_venda: 20
      }]
    };

    await expect(panoCreateService.execute(panoTeste)).rejects.toEqual(
      new AppError("Todos os campos de cadastro devem estar preenchidos.")
    );
  });

  it("Caso o campo itens esteja nulo, retornar um AppError.", async() => {
    const panoTeste = {
      observacoes: "Pano criado para fins de teste",
      id_revendedor,
      itens: null
    };

    await expect(panoCreateService.execute(panoTeste)).rejects.toEqual(
      new AppError("O Pano deve conter ao menos um item")
    );
  });

  it("Caso o campo itens esteja vazio, retornar um AppError.", async() => {
    const panoTeste = {
      observacoes: "Pano criado para fins de teste",
      id_revendedor,
      itens: []
    };

    await expect(panoCreateService.execute(panoTeste)).rejects.toEqual(
      new AppError("O Pano deve conter ao menos um item")
    );
  });

  it("Caso o revendedor não exista, retornar um AppError.", async() => {
    const panoTeste = {
      observacoes: "Pano criado para fins de teste",
      id_revendedor: id_revendedor + 1,
      itens:[{
        id_produto,
        quantidade: 5,
        valor_venda: 20
      }]
    };

    await expect(panoCreateService.execute(panoTeste)).rejects.toEqual(
      new AppError(`O Revendedor id ${ id_revendedor + 1 } não existe.`)
    );
  });
  
});