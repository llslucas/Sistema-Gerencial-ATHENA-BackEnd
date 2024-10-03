import AppError from "../../utils/AppError.js";

export default class RevendedorDeleteService{
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
      throw new AppError("Não é possível excluir o revendedor.");
    }     

    if(!deleted){ 
      throw new AppError("O Revendedor especificado não existe.", 404);
    }
  }
}