import { Produto } from "./Model/Produto/Produto";
import { ProdutoService } from "./Services/ProdutoService"
import { Cliente } from "./Model/Cliente/Cliente";
import { Clientes } from "./Model/Cliente/Clientes";
import { ClienteService } from "./Services/ClienteService";
import { Revendedor } from "./Model/Revendedor/Revendedor";
import { Revendedores } from "./Model/Revendedor/Revendedores";
import { RevendedorService } from "./Services/RevendedorService";

document.querySelector('#app').innerHTML = `
  <h1> Projeto Athena </h1>
  <button id="lista"> Teste Lista </button>
  <button id="cadastro"> Teste Cadastro </button>
  <button id="exclusao"> Teste Exclusao </button>
  <button id="update"> Teste Update </button>
`

const revendedorService = new RevendedorService();

async function listaTudo(){
  const revendedores = new Revendedores(await revendedorService.getAll());
  console.log(revendedores);
}

const revendedor = new Revendedor("Lucas Souza", "123456", 0.1);

async function testeCadastro(){
  const response = await revendedorService.add(revendedor);  
  alert(response);
}

async function testeDel(){
  const response = await revendedorService.delete(5);
  alert(response);
}

async function testeUpdate(){
  const revendedor = new Revendedor("Lucas Souza", "123456", 0.1);
  const response = await revendedorService.atualiza(1, revendedor);
  alert(response);
}

document.querySelector('#lista').addEventListener('click', e => listaTudo());
document.querySelector('#cadastro').addEventListener('click', e => testeCadastro());
document.querySelector('#exclusao').addEventListener('click', e => testeDel());
document.querySelector('#update').addEventListener('click', e => testeUpdate());


