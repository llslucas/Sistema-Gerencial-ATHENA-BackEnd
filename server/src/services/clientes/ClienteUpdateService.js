import AppError from "../../utils/AppError.js";

export default class ClienteUpdateService{
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id, nome, telefone, email }){
    const cliente = await this.#repository.show({ id });

    if(!cliente){
        throw new AppError("O Cliente especificado não existe.", 404);
    }

    cliente.nome = nome ?? cliente.nome;
    cliente.telefone = telefone ?? cliente.telefone;
    cliente.email = email ?? cliente.email;   

    const updated = await this.#repository.update({id, cliente});

    return updated;
  }
}