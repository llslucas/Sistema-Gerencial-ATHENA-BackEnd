import UserRepository from "../../repositories/UserRepository.js";
import UserDeleteService from "./UserDeleteService.js";
import AppError from "../../utils/AppError.js";
import { user } from "../../utils/Examples";

describe("UserDeleteService", () =>{
  /** @type {UserRepository} */
  let repository = null;

  /** @type {UserDeleteService} */
  let userDeleteService = null;

  /** @type {Number} */
  let user_id;

  beforeAll( async() => {
    repository = new UserRepository();        
    userDeleteService = new UserDeleteService(repository); 
    await repository.deleteAll();
  });  

  beforeEach( async() => {  
    user_id = await repository.create(user);    
  });

  afterEach( async() => {
    await repository.deleteAll(); 
  });

  afterAll( async () => { 
    await repository.disconnect();
  });

  it('O Usuário deve ser excluído.', async () => {
    await expect(userDeleteService.execute({ id: user_id })).resolves.not.toEqual(0);
  });

  it('Caso o Usuário não exista retornar um AppError.', async () => {
    await expect(userDeleteService.execute({ id: user_id + 1 })).rejects.toEqual(new AppError("O Usuário especificado não existe.", 404));
  });
  
});