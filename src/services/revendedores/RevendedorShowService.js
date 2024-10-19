import AppError from "../../utils/AppError.js";

export default class RevendedorShowService{
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id }){
    const revendedor = await this.#repository.show({ id });

    if(!revendedor){   
        throw new AppError("O Revendedor especificado não existe.", 404);
    };

    return revendedor;
  }
}