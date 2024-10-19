import PanosRepository from "../../repositories/PanosRepository.js";

export default class PanoShowService{
  /** @type PanosRepository */
  #repository;

  constructor(repository){
  this.#repository = repository;
  }

  async execute({ id }){
    const pano = await this.#repository.show({ id });    
    return pano;
  }
}