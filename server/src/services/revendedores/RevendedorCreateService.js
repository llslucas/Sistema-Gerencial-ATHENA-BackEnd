import AppError from "../../utils/AppError.js";

export default class RevendedorCreateService{
  #repository;

  constructor(repository){    
    this.#repository = repository;
  }

  async execute({ nome, contato, comissao }){

    if( !nome || !contato || !comissao  ){
      throw new AppError("Todas as informações necessárias devem ser informadas.");
    }    

    const revendedor_id = await this.#repository.create({ nome, contato, comissao });

    return revendedor_id;
  }

}