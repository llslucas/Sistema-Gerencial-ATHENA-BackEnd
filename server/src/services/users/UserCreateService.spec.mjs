import UserRepository from '../../repositories/UserRepository.js';
import UserCreateService from './UserCreateService.js';
import AppError from '../../utils/AppError.js';

describe("UserCreateService", () => {
  /** @type {UserRepository} */
  let repository = null;

  /** @type {UserCreateService} */
  let userCreateService = null;

  beforeAll( async () => {
    repository = new UserRepository();
    userCreateService = new UserCreateService(repository);   
    await repository.deleteAll(); 
  });   

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async() => {
    await repository.deleteAll(); 
    await repository.disconnect();
  })

  it("O Usuário deve ser criado", async () => {
    const user = {
      name: "User Creation Test",
      email: "creation@test.com",
      password: "1234"
    };  

    const user_id = await userCreateService.execute(user);    

    expect(user_id).toBeTruthy();
  });

  it("A criação de um usuário com um e-mail que já existe deve resultar em um AppError.", async () => {
    const user1 = {
      name: "User Creation Test 1",
      email: "creation@test.com",
      password: "1234"
    };  

    const user2 = {
      name: "User Creation Test 2",
      email: "creation@test.com",
      password: "12345"
    };  

    await userCreateService.execute(user1);    
    await expect(userCreateService.execute(user2)).rejects.toEqual(new AppError("Este e-mail já está em uso."));
  });

})

