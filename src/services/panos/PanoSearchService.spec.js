import PanosRepository from "../../repositories/PanosRepository.js";
import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import PanoSearchService from "./PanoSearchService.js";
import { produtoTeste, produtoTeste2 } from "../../utils/Examples.js";
import { revendedorTeste, revendedorTeste2 } from "../../utils/Examples.js";
import { FormatPano } from "../../utils/Format.js";

describe("PanoSearchService", () => {
  /** @type {PanosRepository} */
  let repository = null;

  /** @type {RevendedoresRepository} */
  let revendedoresRepository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository = null;

  /** @type {PanoSearchService} */
  let panoSearchService = null;

  let id_revendedor;
  let id_revendedor2;
  let id_produto;
  let id_produto2;
  let id_pano;
  let id_pano2;

  beforeAll(async() => {
    repository = new PanosRepository();
    panoSearchService = new PanoSearchService(repository);
    revendedoresRepository = new RevendedoresRepository();
    produtosRepository = new ProdutosRepository();

    await repository.deleteAll();
    await revendedoresRepository.deleteAll();
    await produtosRepository.deleteAll();
  });

  beforeEach(async() => {    
    id_produto = await produtosRepository.create(produtoTeste);
    id_produto2 = await produtosRepository.create(produtoTeste2);
    id_revendedor = await revendedoresRepository.create(revendedorTeste);
    id_revendedor2 = await revendedoresRepository.create(revendedorTeste2);    

    const panoTeste = {
      observacoes: "Pano criado para fins de teste",
      id_revendedor,
      itens:[{
        id_produto,
        quantidade: 5,
        valor_venda: 20
      }]
    };

    const panoTeste2 = {
      observacoes: "Outro Pano",
      id_revendedor: id_revendedor2,
      itens:[{
        id_produto: id_produto2,
        quantidade: 10,
        valor_venda: 40
      }]
    };

    id_pano = await repository.create(panoTeste);
    id_pano2 = await repository.create(panoTeste2);
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

  it("Uma busca em branco deve retornar todos os panos.", async() => {
    const panos = await panoSearchService.execute({});
    expect(panos).toHaveLength(2);
  });

  it("Uma busca pelo ID deve retornar o pano esperado.", async() => {
    const panos = await panoSearchService.execute({search: id_pano});

    const panoEsperado = [{
      observacoes: "Pano criado para fins de teste",
      id_revendedor,
      itens:[{
        id_produto,
        quantidade: 5,
        valor_venda: 20
      }]
    }];

    const panosRecebidos = panos.map(FormatPano);

    expect(panosRecebidos).toEqual(panoEsperado);
  });

  it("Uma busca pela observação deve retornar o pano esperado.", async() => {
    const panos = await panoSearchService.execute({search: "Pano criado para fins de teste"});

    const panoEsperado = [{
      observacoes: "Pano criado para fins de teste",
      id_revendedor,
      itens:[{
        id_produto,
        quantidade: 5,
        valor_venda: 20
      }]
    }];

    const panosRecebidos = panos.map(FormatPano);

    expect(panosRecebidos).toEqual(panoEsperado);
  });

  it("Uma busca pelo nome do revendedor deve retornar o pano esperado.", async() => {
    const panos = await panoSearchService.execute({search: "Revendedor Teste"});

    const panoEsperado = [{
      observacoes: "Pano criado para fins de teste",
      id_revendedor,
      itens:[{
        id_produto,
        quantidade: 5,
        valor_venda: 20
      }]
    }];

    const panosRecebidos = panos.map(FormatPano);

    expect(panosRecebidos).toEqual(panoEsperado);
  });

  it("Uma busca pelo nome do produto deve retornar o pano esperado.", async() => {
    const panos = await panoSearchService.execute({search: "Produto Teste"});

    const panoEsperado = [{
      observacoes: "Pano criado para fins de teste",
      id_revendedor,
      itens:[{
        id_produto,
        quantidade: 5,
        valor_venda: 20
      }]
    }];

    const panosRecebidos = panos.map(FormatPano);

    expect(panosRecebidos).toEqual(panoEsperado);
  });

  it("Uma busca incorreta deve retornar um array vazio.", async () => {
    const panos = await panoSearchService.execute({search: "Pano Inexistente"}); 

    expect(panos).toHaveLength(0);
  }); 
  
});