import AppError from "../../utils/AppError.js";

export default class ProdutoShowService{
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id }){
    const produto = await this.#repository.show({ id });

    if(!produto){   
        throw new AppError("O Produto especificado não existe.", 404);
    };

    return produto;
  }
}