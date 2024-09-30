import AppError from "../../utils/AppError.js";

export default class ClienteCreateService{
  #repository;

  constructor(repository){    
    this.#repository = repository;
  }

  async execute({ nome, telefone, email }){
    if(!nome || !telefone || !email){
      throw new AppError("Todas as informações necessárias devem ser informadas.");
    }

    const cliente_id = await this.#repository.create({ nome, telefone, email });

    return cliente_id;
  }

}