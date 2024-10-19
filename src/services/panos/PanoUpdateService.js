import PanosRepository from "../../repositories/PanosRepository.js";
import AppError from "../../utils/AppError.js";

export default class PanoUpdateService{
  /** @type PanosRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;
  }

  async execute({ id, id_revendedor, observacoes, itens }){
    const pano = await this.#repository.show({ id });

    if(!pano){
      throw new AppError("O Pano especificado não existe.", 404);
    }

    if(!id_revendedor && !observacoes && !itens){
      throw new AppError("Pelo menos um campo a ser alterado deve ser informado.");
    }

    const newPano = {};

    newPano.id_revendedor = id_revendedor ?? pano.revendedor.id;
    newPano.observacoes = observacoes ?? pano.observacoes;

    await this.#repository.update({
      id,
      ...newPano,
      itens
    });    
  }
}