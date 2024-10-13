import PanosRepository from "../../repositories/PanosRepository.js";
import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import PanoUpdateService from "./PanoUpdateService.js";
import { produtoTeste, produtoTeste2 } from "../../utils/Examples.js";
import { revendedorTeste, revendedorTeste2 } from "../../utils/Examples.js";
import { FormatPano } from "../../utils/Format.js";
import AppError from "../../utils/AppError.js";

describe("PanoUpdateService", () => {
  /** @type {PanosRepository} */
  let repository = null;

  /** @type {RevendedoresRepository} */
  let revendedoresRepository = null;

  /** @type {ProdutosRepository} */
  let produtosRepository = null;

  /** @type {PanoUpdateService} */
  let panoUpdateService = null;

  let id_revendedor;
  let id_revendedor2;
  let id_produto;
  let id_produto2;
  let id_pano;

  beforeAll(async() => {
    repository = new PanosRepository();
    panoUpdateService = new PanoUpdateService(repository);
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

  it("Atualizar uma pano que não existe deve retornar um AppError.", async() => {    
    await expect(panoUpdateService.execute({ id: id_pano + 1, observacoes: "Teste" })).rejects.toEqual(
      new AppError("O Pano especificado não existe.", 404)
    );
  });

  it("Se nenhum campo for mencionado, retornar um AppError.", async() => {    
    await expect(panoUpdateService.execute({ id: id_pano })).rejects.toEqual(
      new AppError("Pelo menos um campo a ser alterado deve ser informado.")
    );
  });

  it("Se um produto que não existe for informado, retornar um AppError", async() => {
    const itens = [{
      id_produto: id_produto2 + 1,
      quantidade: 10,
      valor_unitario: 22.22,
      valor_total: (22.22 * 10)
    }];

    await expect(panoUpdateService.execute({ id: id_pano, itens})).rejects.toEqual(
      new AppError(`O Produto com o ID: ${ id_produto2 + 1 } não existe.`, 404)
    );
  });

  it("Se um revendedor que não existe for informado, retornar um AppError", async() => { 
    await expect(panoUpdateService.execute({ id: id_pano, id_revendedor: id_revendedor2 + 1 })).rejects.toEqual(
      new AppError(`O Revendedor com ID: ${id_revendedor2 + 1} não existe.`, 404)
    );
  });

  it("As Observações devem ser alteradas.", async() => {
    await panoUpdateService.execute({ id: id_pano, observacoes: "Nova Observação" });

    const panoEsperado = {
      observacoes: "Nova Observação",
      id_revendedor,
      itens:[{
        id_produto,
        quantidade: 5,
        valor_venda: 20
      }]
    };

    const panoAlterado = FormatPano(await repository.show({ id: id_pano }));

    expect(panoAlterado).toEqual(panoEsperado);
  });  

  it("O Revendedor deve ser alteradao.", async() => {
    await panoUpdateService.execute({ id: id_pano, id_revendedor: id_revendedor2 });

    const panoEsperado = {
      observacoes: "Pano criado para fins de teste",
      id_revendedor: id_revendedor2,
      itens:[{
        id_produto,
        quantidade: 5,
        valor_venda: 20
      }]
    };

    const panoAlterado = FormatPano(await repository.show({ id: id_pano }));

    expect(panoAlterado).toEqual(panoEsperado);
  });  

  it("Os itens devem ser alterados.", async() => {
    const novosItens = [      
      {        
        id_produto: id_produto2,
        quantidade: 20,
        valor_venda: 15       
      },
      {        
        id_produto,
        quantidade: 10,
        valor_venda: 25       
      }
    ]

    await panoUpdateService.execute({ id: id_pano, itens: novosItens });

    const panoEsperado = {
      observacoes: "Pano criado para fins de teste",
      id_revendedor: id_revendedor,
      itens: novosItens
    };

    const panoAlterado = FormatPano(await repository.show({ id: id_pano }));

    expect(panoAlterado).toEqual(panoEsperado);
  }); 
});