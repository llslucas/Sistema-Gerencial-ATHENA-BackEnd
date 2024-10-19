import AppError from "../../utils/AppError.js";

export default class ClienteShowService{
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id }){
    const cliente = await this.#repository.show({ id });

    if(!cliente){   
        throw new AppError("O Cliente especificado não existe.", 404);
    };

    return cliente;
  }
}