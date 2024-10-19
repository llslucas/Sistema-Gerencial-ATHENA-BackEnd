import AppError from "../../utils/AppError.js";

export default class ProdutoDeleteService{
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id }){
    let deleted;

    try{
      deleted = await this.#repository.delete({ id });      
    }catch(e){            
      console.log(e);
      throw new AppError("Não é possível excluir o produto.");
    }     

    if(!deleted){ 
      throw new AppError("O Produto especificado não existe.", 404);
    }
  }
}