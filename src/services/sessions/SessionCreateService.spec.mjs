import UserRepository from "../../repositories/UserRepository.js";
import SessionCreateService from "./SessionCreateService.js";
import AppError from "../../utils/AppError.js";

import bcryptjs from 'bcryptjs';
const { hash } = bcryptjs;

describe("SessionCreateService", () =>{
  /** @type {UserRepository} */
  let repository = null;

  /** @type {SessionCreateService} */
  let sessionCreateService = null;

  beforeAll( async() => {
    repository = new UserRepository();        
    sessionCreateService = new SessionCreateService(repository); 
    await repository.deleteAll();
  });  

  beforeEach( async() => {
    await repository.create({name: 'User Test 1', email: "test@user.com", role:"user", password: await hash("1234", 8)});    
  });

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async () => { 
    await repository.disconnect();
  });

  it("A Sessão deve ser criada caso o e-mail e senha estejam corretos.", async () => {
    const userLogin = {
      email: "test@user.com",
      password: "1234"
    }

    const sessionData = await sessionCreateService.execute(userLogin);

    expect(sessionData).toBeDefined();    
  });

  it("A criação de uma sessão com um e-mail que não existe deve resultar em um AppError", async () => {
    const userLogin = {
      email: "wrong@user.com",
      password: "1234"
    }    

    await expect(sessionCreateService.execute(userLogin)).rejects.toEqual(new AppError("Usuário e/ou senha incorreta", 401));    
  });

  it("A criação de uma sessão com a senha errada deve resultar em um AppError", async () => {
    const userLogin = {
      email: "test@user.com",
      password: "wrong"
    }    

    await expect(sessionCreateService.execute(userLogin)).rejects.toEqual(new AppError("Usuário e/ou senha incorreta", 401));    
  });

});