import UserRepository from '../../repositories/UserRepository.js';
import UserUpdateService from './UserUpdateService.js';
import AppError from '../../utils/AppError.js';

import bcryptjs from 'bcryptjs';
const { hash, compare } = bcryptjs;

describe("UserUpdateService", () => {
  /** @type {UserRepository} */
  let repository = null;

  /** @type {UserUpdateService} */
  let userUpdateService = null;   

  beforeAll( async() => {
    repository = new UserRepository();        
    userUpdateService = new UserUpdateService(repository); 
    await repository.deleteAll();
  })
  
  beforeEach( async () => {
    await repository.create({name: 'User Test 1', email: "test@user.com", role:"user", password: await hash("1234", 8)});    
    await repository.create({name: 'User Test 2', email: "test2@user.com", role:"user", password: await hash("1234", 8)});    
  })   

  afterEach( async() => {
    await repository.deleteAll();
  })

  afterAll( async () => {     
    await repository.disconnect();
  })

  it("O Nome do usuário deve ser alterado.", async() => {   
    const user = await repository.findByEmail("test@user.com");        
    const newName = "Updated Name";

    const updatedUser = await userUpdateService.execute({user_id: user.id, name: newName});
    
    expect(updatedUser.name).toBe(newName);
  });

  it("O E-mail do usuário deve ser alterado.", async() => {   
    const user = await repository.findByEmail("test@user.com");        
    const newEmail = "newemail@user.com";

    const updatedUser = await userUpdateService.execute({user_id: user.id, email: newEmail});
    
    expect(updatedUser.email).toBe(newEmail);
  });

  it("A Senha do Usuário deve ser alterada.", async() => {   
    const user = await repository.findByEmail("test@user.com");        
    const oldPassword = "1234";
    const newPassword = "12345";

    const updatedUser = await userUpdateService.execute({user_id: user.id, old_password: oldPassword, password: newPassword});
    
    expect(await compare(newPassword, updatedUser.password)).toBeTruthy();
  });

  it("O Role do usuário deve ser alterado.", async() => {   
    const user = await repository.findByEmail("test@user.com");        
    const newRole = "admin";

    const updatedUser = await userUpdateService.execute({user_id: user.id, role: newRole});
    
    expect(updatedUser.role).toBe(newRole);
  });

  it("Uma tentativa para alterar para um Role que não existe deve resultar em um AppError.", async() => {   
    const user = await repository.findByEmail("test@user.com");        
    const newRole = "Unknown Role";
     
    await expect(userUpdateService.execute({user_id: user.id, role: newRole})).rejects.toEqual(new AppError("Role inválido"));
  });

  it("Uma tentativa de atualizar um usuário que não existe deve resultar em um AppError.", async () => {
    const unknownUser = {
      user_id: 0,
      name: "Test User",
      email: "user@unknownmail.com",      
    }       

    await expect(userUpdateService.execute(unknownUser)).rejects.toEqual(new AppError('Usuário não encontrado'));
  }); 

  it("Uma tentativa de atualizar para um e-mail que já existe deve resultar em um AppError.", async () => {
    const user = await repository.findByEmail("test@user.com");        
    const newEmail = "test2@user.com"; 

    await expect(userUpdateService.execute({user_id: user.id, email: newEmail})).rejects.toEqual(new AppError("Este e-mail já está em uso."));
  }); 

  it("Uma tentativa de atualizar a senha sem a senha antiga deve resultar em um AppError.", async () => {
    const user = await repository.findByEmail("test@user.com");            
    const newPassword = "12345";    

    await expect(userUpdateService.execute({user_id: user.id, password: newPassword}))
            .rejects.toEqual(new AppError("Você precisa informar a senha antiga para redefinir a nova senha."));
  }); 

  it("Uma tentativa de atualizar a senha com a senha antiga errada deve resultar em um AppError.", async () => {
    const user = await repository.findByEmail("test@user.com");        
    const oldPassword = "wrong password";
    const newPassword = "12345";    

    await expect(userUpdateService.execute({user_id: user.id, old_password: oldPassword, password: newPassword}))
            .rejects.toEqual(new AppError("A senha antiga não confere."));
  }); 
});
