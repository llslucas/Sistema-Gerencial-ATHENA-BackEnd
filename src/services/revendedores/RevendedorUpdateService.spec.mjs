import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import RevendedorUpdateService from "./RevendedorUpdateService.js";
import AppError from "../../utils/AppError.js";

describe("RevendedorUpdateService", () =>{
  /** @type {RevendedoresRepository} */
  let repository = null;

  /** @type {RevendedorUpdateService} */
  let revendedorUpdateService = null;

  let produto_id;

  beforeAll( async() => {
    repository = new RevendedoresRepository();        
    revendedorUpdateService = new RevendedorUpdateService(repository); 
    await repository.deleteAll();
  });  

  beforeEach( async() => {
    const revendedorTeste = {           
      nome: "Revendedor Teste",
      contato: "123456",
      comissao: 20
    }

    produto_id = await repository.create(revendedorTeste);  
  });

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async () => { 
    await repository.disconnect();
  });

  it("O nome do revendedor deve ser atualizado.", async() => {
    await revendedorUpdateService.execute({ id: produto_id, nome: "Revendedor Atualizado"});

    const revendedor = await repository.show({ id: produto_id });

    expect(revendedor.nome).toBe("Revendedor Atualizado");
  });

  it("O contato do revendedor deve ser atualizada.", async() => {
    await revendedorUpdateService.execute({ id: produto_id, contato: "987654"});

    const revendedor = await repository.show({ id: produto_id });

    expect(revendedor.contato).toBe("987654");
  });

  it("A comissao do revendedor deve ser atualizada.", async() => {
    await revendedorUpdateService.execute({ id: produto_id, comissao: 55});

    const revendedor = await repository.show({ id: produto_id });

    expect(revendedor.comissao).toBe(55);
  }); 

  it("Caso o revendedor não exista, retornar um AppError", async() => { 
    await expect(revendedorUpdateService.execute({ id: produto_id + 1, nome: "Revendedor Atualizado"}))
      .rejects.toEqual(new AppError("O Revendedor especificado não existe.", 404));
  });
});