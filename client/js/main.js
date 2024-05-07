import { Produto } from "./Model/Produto/Produto";
import { ProdutoService } from "./Services/ProdutoService"
import { Cliente } from "./Model/Cliente/Cliente";
import { ClienteService } from "./Services/ClienteService";

document.querySelector('#app').innerHTML = `
  <h1> Projeto Athena </h1>
  <button id="lista"> Teste Lista </button>
  <button id="cadastro"> Teste Cadastro </button>
  <button id="exclusao"> Teste Exclusao </button>
`

const clienteService = new ClienteService();

async function listaTudo(){
  const clientes = await clienteService.getClientes();
  console.log(clientes);
}

const cliente = new Cliente("Teste", "123456", "teste@email.com");

async function testeCadastro(){
  const response = await clienteService.addCliente(cliente);  
  alert(response);
}

async function testeDel(){
  const response = await clienteService.deleteCliente(5);
  alert(response);
}

document.querySelector('#lista').addEventListener('click', e => listaTudo());
document.querySelector('#cadastro').addEventListener('click', e => testeCadastro());
document.querySelector('#exclusao').addEventListener('click', e => testeDel());


