import ClientesRepository from "../../repositories/ClientesRepository.js";
import ClienteUpdateService from "./ClienteUpdateService.js";
import AppError from "../../utils/AppError.js";

describe("ClienteUpdateService", () =>{
  /** @type {ClientesRepository} */
  let repository = null;

  /** @type {ClienteUpdateService} */
  let clienteUpdateService = null;

  let cliente_id;

  beforeAll( async() => {
    repository = new ClientesRepository();        
    clienteUpdateService = new ClienteUpdateService(repository); 
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

  it("O nome do cliente deve ser atualizado.", async() => {
    await clienteUpdateService.execute({ id: cliente_id, nome: "Cliente Atualizado"});

    const cliente = await repository.show({ id: cliente_id });

    expect(cliente.nome).toBe("Cliente Atualizado");
  });

  it("O telefone do cliente deve ser atualizado.", async() => {
    await clienteUpdateService.execute({ id: cliente_id, telefone: "987654321"});

    const cliente = await repository.show({ id: cliente_id });

    expect(cliente.telefone).toBe("987654321");
  });

  it("O email do cliente deve ser atualizado.", async() => {
    await clienteUpdateService.execute({ id: cliente_id, email: "novo@email.com"});

    const cliente = await repository.show({ id: cliente_id });

    expect(cliente.email).toBe("novo@email.com");
  });

  it("Caso o cliente não exista, retornar um AppError", async() => { 
    await expect(clienteUpdateService.execute({ id: cliente_id + 1, nome: "Cliente Atualizado"}))
      .rejects.toEqual(new AppError("O Cliente especificado não existe.", 404));
  });
});