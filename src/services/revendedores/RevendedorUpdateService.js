import AppError from "../../utils/AppError.js";

export default class RevendedorUpdateService{
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id, nome, contato, comissao } ){
    const revendedor = await this.#repository.show({ id });

    if(!revendedor){
        throw new AppError("O Revendedor especificado não existe.", 404);
    }

    revendedor.nome = nome ?? revendedor.nome;
    revendedor.contato = contato ?? revendedor.contato;
    revendedor.comissao = comissao ?? revendedor.comissao;  

    const updated = await this.#repository.update({id, revendedor});

    return updated;
  }
}