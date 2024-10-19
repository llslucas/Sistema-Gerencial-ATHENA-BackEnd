import ClientesRepository from "../../repositories/ClientesRepository.js";
import ClienteShowService from "./ClienteShowService.js";
import AppError from "../../utils/AppError.js";

describe("ClienteShowService", () =>{
  /** @type {ClientesRepository} */
  let repository = null;

  /** @type {ClienteShowService} */
  let clienteShowService = null;

  let cliente_id;

  beforeAll( async() => {
    repository = new ClientesRepository();        
    clienteShowService = new ClienteShowService(repository); 
    await repository.deleteAll();
  });  

  beforeEach( async() => {
    const clienteTeste = {           
      nome: "Cliente",
      telefone: "123456",
      email: "cliente@email.com"      
    }

    cliente_id = await repository.create(clienteTeste);  
  });

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async () => { 
    await repository.disconnect();
  });

  it("O Cliente deve ser retornado.", async () => {
    const cliente = await clienteShowService.execute({ id: cliente_id });

    expect(cliente).toBeDefined();
  });

  it("Caso o cliente não exista deve retornar um AppError.", async () => {
    await expect(clienteShowService.execute({ id: cliente_id + 1 })).rejects.toEqual(new AppError("O Cliente especificado não existe.", 404));   
  });
  
});