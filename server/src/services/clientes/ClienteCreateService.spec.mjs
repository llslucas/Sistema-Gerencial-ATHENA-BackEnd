import ClientesRepository from "../../repositories/ClientesRepository.js";
import ClienteCreateService from "./ClienteCreateService.js";
import AppError from "../../utils/AppError.js";

describe("ClienteCreateService", () =>{
  /** @type {ClientesRepository} */
  let repository = null;

  /** @type {ClienteCreateService} */
  let clienteCreateService = null;

  beforeAll( async() => {
    repository = new ClientesRepository();        
    clienteCreateService = new ClienteCreateService(repository); 
    await repository.deleteAll();
  });  

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async () => { 
    await repository.disconnect();
  });

  it("O usuário deve ser criado.", async () => {
    const clienteTeste = {           
      nome: "Cliente Teste",
      telefone: "123456",
      email: "teste@email.com"      
    }

    const cliente_id = await clienteCreateService.execute(clienteTeste);    
    expect(cliente_id).toBeDefined();    
  });  

  it("Caso o campo nome esteja em branco deve retornar um AppError.", async() => {
    const clienteTeste = {  
      telefone: "123456",
      email: "teste@email.com"      
    }

    await expect(clienteCreateService.execute(clienteTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas."));
  });

  it("Caso o campo telefone esteja em branco deve retornar um AppError.", async() => {
    const clienteTeste = {  
      nome: "Cliente Teste", 
      email: "teste@email.com"     
    }

    await expect(clienteCreateService.execute(clienteTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas."));
  });

  it("Caso o campo email esteja em branco deve retornar um AppError.", async() => {
    const clienteTeste = {  
      nome: "Cliente Teste", 
      telefone: "123456"  
    }

    await expect(clienteCreateService.execute(clienteTeste)).rejects.toEqual(new AppError("Todas as informações necessárias devem ser informadas."));
  });
});