import PanosRepository from "../../repositories/PanosRepository.js";
import AppError from "../../utils/AppError.js";

export default class PanoDeleteService{
  /** @type PanosRepository */
  #repository;

  constructor(repository){
    this.#repository = repository;    
  }

  async execute({ id }){
    const deleted = await this.#repository.delete({ id });

    if(!deleted){
      throw new AppError("O pano especificado não existe.", 404);
    }

    return deleted;
  }
}