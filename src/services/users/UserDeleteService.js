import UserRepository from "../../repositories/UserRepository.js";
import AppError from "../../utils/AppError.js";

export default class UserDeleteService{
  /** @type UserRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id }){
    let deleted;

    try{
      deleted = await this.#repository.delete({ id });
    }catch(e){
      throw new AppError("Não foi possível excluir o usuário.");
    }

    if(deleted === 0){
      throw new AppError("O Usuário especificado não existe.", 404);
    }
  }
}