import EstoqueRepository from "../../repositories/EstoqueRepository.js";
import ProdutosRepository from "../../repositories/ProdutosRepository.js";

export default class AtualizaEstoqueService{
  /** @type EstoqueRepository */
  #estoqueRepository;

  /** @type ProdutosRepository */
  #produtosRepository;

  constructor({ estoqueRepository, produtosRepository }){
    this.#estoqueRepository = estoqueRepository;
    this.#produtosRepository = produtosRepository;
  }

  async execute({ id_produto }){
    const produto = await this.#produtosRepository.show({id: id_produto});
    
    produto.estoque_atual = await this.#estoqueRepository.calcularSaldo(id_produto);

    await this.#produtosRepository.update({ id: id_produto, produto });  

    return produto;    
  }
}