import ComprasRepository from "../../repositories/ComprasRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";
import AppError from "../../utils/AppError.js";

export default class CompraCreateService{
  /**@type ComprasRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ numero_nota, fornecedor, data_compra, itens }){ 
    if(!numero_nota || !fornecedor || !data_compra){
      throw new AppError("Todas as informações necessárias devem ser informadas.", 400);
    }
    
    if(!itens || !itens.length){
      throw new AppError("Não é possível cadastrar uma compra sem itens.", 400);
    }

    if(await this.#repository.checkIfExists({ numero_nota })){
      throw new AppError("Já existe uma nota com este número cadastrada.", 404);
    }

    //Verifica se dentro do array items existe algum produto que não existe.    
    const produtosRepository = new ProdutosRepository();

    for(const item of itens){      
      if(!await produtosRepository.show({ id: item.id_produto })){
        throw new AppError(`O Produto com o ID: ${item.id_produto} não existe.`, 404);
      }
    }

    const id_compra = await this.#repository.create({ numero_nota, fornecedor, data_compra, itens });

    return id_compra;
  }
}