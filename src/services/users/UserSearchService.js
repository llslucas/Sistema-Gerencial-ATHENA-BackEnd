import UserRepository from "../../repositories/UserRepository.js";

export default class UserSearchService{
  /** @type UserRepository */
  #repository;

  constructor(repository){
    this.#repository = repository
  }

  async execute({ search }){
    const searchValue = search ?? '';
    const usuarios = this.#repository.search({ search: searchValue });
    return usuarios;
  }
}