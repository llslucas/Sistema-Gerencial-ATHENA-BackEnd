import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import RevendedorCreateService from "./RevendedorCreateService.js";
import AppError from "../../utils/AppError.js";

describe("RevendedorCreateService", () =>{
  /** @type {RevendedoresRepository} */
  let repository = null;

  /** @type {RevendedorCreateService} */
  let revendedorCreateService = null;

  beforeAll( async() => {
    repository = new RevendedoresRepository();        
    revendedorCreateService = new RevendedorCreateService(repository); 
    await repository.deleteAll();
  });  

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async () => { 
    await repository.disconnect();
  });

  it("O revendedor deve ser criado.", async () => {
    const revendedor = {           
      nome: "Revendedor Teste",
      contato: "123456",
      comissao: 20
    }

    const revendedor_id = await revendedorCreateService.execute(revendedor);    
    expect(revendedor_id).toBeDefined();    
  });  

  it("Caso o campo nome esteja em branco deve retornar um AppError.", async() => {
    const revendedor = {   
      contato: "123456",
      comissao: 20
    }

    await expect(revendedorCreateService.execute(revendedor)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas."));
  });

  it("Caso o campo contato esteja em branco deve retornar um AppError.", async() => {
    const revendedor = {           
      nome: "Revendedor Teste",
      comissao: 20
    }

    await expect(revendedorCreateService.execute(revendedor)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas."));
  });

  it("Caso o campo comissao esteja em branco deve retornar um AppError.", async() => {
    const revendedor = {           
      nome: "Revendedor Teste",
      contato: "123456"
    }

    await expect(revendedorCreateService.execute(revendedor)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas."));
  });
});