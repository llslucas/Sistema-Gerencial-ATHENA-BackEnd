import UserRepository from "../../repositories/UserRepository.js";
import UserSearchService from "./UserSearchService.js";
import { user, user2 } from "../../utils/Examples.js";
import AppError from "../../utils/AppError.js";

describe("UserSearchService", () =>{
  /** @type {UserRepository} */
  let repository = null;

  /** @type {UserSearchService} */
  let userSearchService = null;

  beforeAll( async() => {
    repository = new UserRepository();        
    userSearchService = new UserSearchService(repository); 
    await repository.deleteAll();
  });  

  beforeEach( async() => {   
    await repository.create(user);    
    await repository.create(user2);    
  });

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async () => { 
    await repository.disconnect();
  });


  it("Uma busca em branco deve retornar todos os usuarios.", async () => {
    const usuarios = await userSearchService.execute({search: ""});

    expect(usuarios).toHaveLength(2);
  });

  it("Uma busca com valores em comum deve retornar todos os usuarios com o valor.", async () => {
    const usuarios = await userSearchService.execute({search: "Teste"});

    expect(usuarios).toHaveLength(2);
  });

  it("A busca deve retornar o usuario esperado.", async () => {
    const [usuario] = await userSearchService.execute({search: "Teste Usuário 1"});

    const usuarioEsperado = {           
      name: "Teste Usuário 1",
      email: "user@test.com", 
      role: "user"
    }

    usuarioEsperado.id = usuario.id;

    expect(usuario).toEqual(usuarioEsperado);
  }); 
});