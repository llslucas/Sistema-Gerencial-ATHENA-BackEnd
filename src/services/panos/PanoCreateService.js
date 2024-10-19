import PanosRepository from "../../repositories/PanosRepository.js";
import AppError from "../../utils/AppError.js";

export default class PanoCreateService{

  /** @type PanosRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;
  };

  async execute({ id_revendedor, observacoes, itens }){
    if(!id_revendedor || !observacoes){
      throw new AppError("Todos os campos de cadastro devem estar preenchidos.");
    }

    if(!itens || !itens.length){
      throw new AppError("O Pano deve conter ao menos um item");
    }

    const pano_id = await this.#repository.create({ id_revendedor, observacoes, itens });

    return pano_id;
  };
};