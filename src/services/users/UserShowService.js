import UserRepository from "../../repositories/UserRepository.js";
import AppError from "../../utils/AppError.js";

export default class UserShowService{
  /** @type UserRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id }){
    const usuario = this.#repository.show({ id });

    if(!usuario){
      throw new AppError("O Usuário especificado não existe.", 404);
    }

    return usuario;
  }
}
