import AtualizaEstoqueService from "../services/estoque/AtualizaEstoqueService.js";
import EstoqueRepository from "../repositories/EstoqueRepository.js";
import ProdutosRepository from "../repositories/ProdutosRepository.js";

export default function atualizarEstoque(request, response, next){
  const { itens } = request.body;

  console.log(itens);

  if(id_produto){    
    const produtosRepository = new ProdutosRepository();
    const estoqueRepository = new EstoqueRepository();
    const atualizaEstoqueService = new AtualizaEstoqueService(estoqueRepository, produtosRepository);

    for(const item in itens){
      atualizaEstoqueService.execute({id_produto: item.id});
    }    
  }

  next();
}