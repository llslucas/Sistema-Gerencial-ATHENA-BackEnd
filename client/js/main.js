import { Produto } from "./Model/Produto/Produto";
import { ProdutoService } from "./Services/ProdutoService"

document.querySelector('#app').innerHTML = `
  <h1> Projeto Athena </h1>
  <button id="lista"> Teste Lista </button>
  <button id="cadastro"> Teste Cadastro </button>
  <button id="exclusao"> Teste Exclusao </button>
`

const produtoService = new ProdutoService();

async function listaTudo(){
  const produtos = await produtoService.getProdutos();
  console.log(produtos);
}

// const produto = await produtoService.getProduto(9);
// console.log(produto);

const produto2 = new Produto("Teste", "Teste de cadastro", "Testes", "55", "10");
// console.log(produto2);

async function testeCadastro(){
  const response = await produtoService.addProduto(produto2);  
  alert(response);
}

async function testeDel(){
  const response = await produtoService.deleteProduto(12);
  alert(response);
}

document.querySelector('#lista').addEventListener('click', e => listaTudo());
document.querySelector('#cadastro').addEventListener('click', e => testeCadastro());
document.querySelector('#exclusao').addEventListener('click', e => testeDel());


