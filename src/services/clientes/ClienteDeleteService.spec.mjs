import ClientesRepository from "../../repositories/ClientesRepository.js";
import ClienteDeleteService from "./ClienteDeleteService.js";
import AppError from "../../utils/AppError.js";

describe("ClienteDeleteService", () =>{
  /** @type {ClientesRepository} */
  let repository = null;

  /** @type {ClienteDeleteService} */
  let clienteDeleteService = null;

  /** @type {Number} */
  let cliente_id;

  beforeAll( async() => {
    repository = new ClientesRepository();        
    clienteDeleteService = new ClienteDeleteService(repository); 
    await repository.deleteAll();
  });  

  beforeEach( async() => {
    const clienteTeste = {           
      nome: "Cliente Teste",
      telefone: "123456",
      email: "teste@email.com"      
    }

    cliente_id = await repository.create(clienteTeste);    
  });

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async () => { 
    await repository.disconnect();
  });

  it('O Usuário deve ser excluído.', async () => {
    await expect(clienteDeleteService.execute({ id: cliente_id })).resolves.not.toEqual(0);
  });

  it('Caso o Usuário não exista retornar um AppError.', async () => {
    await expect(clienteDeleteService.execute({ id: cliente_id + 1 })).rejects.toEqual(new AppError("O Cliente especificado não existe.", 404));
  });
  
});