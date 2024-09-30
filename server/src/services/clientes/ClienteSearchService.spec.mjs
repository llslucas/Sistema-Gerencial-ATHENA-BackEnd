import ClientesRepository from "../../repositories/ClientesRepository.js";
import ClienteSearchService from "./ClienteSearchService.js";
import AppError from "../../utils/AppError.js";

describe("ClienteSearchService", () =>{
  /** @type {ClientesRepository} */
  let repository = null;

  /** @type {ClienteSearchService} */
  let clienteSearchService = null;

  beforeAll( async() => {
    repository = new ClientesRepository();        
    clienteSearchService = new ClienteSearchService(repository); 
    await repository.deleteAll();
  });  

  beforeEach( async() => {
    const clienteTeste = {           
      nome: "Cliente",
      telefone: "123456",
      email: "cliente@email.com"      
    }

    const clienteTeste2 = {           
      nome: "Teste",
      telefone: "123456",
      email: "teste@email.com"      
    }

    await repository.create(clienteTeste);    
    await repository.create(clienteTeste2);    
  });

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async () => { 
    await repository.disconnect();
  });


  it("Uma busca em branco deve retornar todos os clientes.", async () => {
    const clientes = await clienteSearchService.execute({search: ""});

    expect(clientes).toHaveLength(2);
  });

  it("Uma busca com valores em comum deve retornar todos os clientes com o valor.", async () => {
    const clientes = await clienteSearchService.execute({search: "email"});

    expect(clientes).toHaveLength(2);
  });

  it("A busca deve retornar o cliente esperado.", async () => {
    const [cliente] = await clienteSearchService.execute({search: "Cliente"});

    const clienteEsperado = {           
      nome: "Cliente",
      telefone: "123456",
      email: "cliente@email.com"      
    }   

    clienteEsperado.id = cliente.id;
    clienteEsperado.created_at = cliente.created_at;
    clienteEsperado.updated_at = cliente.updated_at;

    expect(cliente).toEqual(clienteEsperado);
  }); 
});