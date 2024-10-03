import RevendedoresRepository from "../../repositories/RevendedoresRepository.js";
import RevendedorDeleteService from "./RevendedorDeleteService.js";
import AppError from "../../utils/AppError.js";

describe("RevendedorDeleteService", () =>{
  /** @type {RevendedoresRepository} */
  let repository = null;

  /** @type {RevendedorDeleteService} */
  let revendedorDeleteService = null;

  /** @type {Number} */
  let revendedor_id;

  beforeAll( async() => {
    repository = new RevendedoresRepository();        
    revendedorDeleteService = new RevendedorDeleteService(repository); 
    await repository.deleteAll();
  });  

  beforeEach( async() => {
    const revendedorTeste = {           
      nome: "Revendedor Teste",
      contato: "123456",
      comissao: 20
    }

    revendedor_id = await repository.create(revendedorTeste);    
  });

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async () => { 
    await repository.disconnect();
  });

  it('O Revendedor deve ser excluído.', async () => {
    await expect(revendedorDeleteService.execute({ id: revendedor_id })).resolves.not.toEqual(0);
  });

  it('Caso o Revendedor não exista retornar um AppError.', async () => {
    await expect(revendedorDeleteService.execute({ id: revendedor_id + 1 })).rejects.toEqual(new AppError("O Revendedor especificado não existe.", 404));
  });
  
});