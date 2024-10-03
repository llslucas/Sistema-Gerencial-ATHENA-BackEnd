import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import RevendedorShowService from "./RevendedorShowService.js";
import AppError from "../../utils/AppError.js";

describe("RevendedorShowService", () =>{
  /** @type {RevendedoresRepository} */
  let repository = null;

  /** @type {RevendedorShowService} */
  let revendedorShowService = null;

  let produto_id;

  beforeAll( async() => {
    repository = new RevendedoresRepository();        
    revendedorShowService = new RevendedorShowService(repository); 
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

  it("O Revendedor deve ser retornado.", async () => {
    const cliente = await revendedorShowService.execute({ id: produto_id });

    expect(cliente).toBeDefined();
  });

  it("Caso o revendedor não exista deve retornar um AppError.", async () => {
    await expect(revendedorShowService.execute({ id: produto_id + 1 })).rejects.toEqual(new AppError("O Revendedor especificado não existe.", 404));   
  });
  
});