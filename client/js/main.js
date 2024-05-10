import { ViewClientes } from "./View/viewClientes";
import { Cliente } from "./Model/Cliente/Cliente";
import { Clientes } from "./Model/Cliente/Clientes";
import { ClienteService } from "./Services/ClienteService";

const view = new ViewClientes("#app");
const service = new ClienteService();

let clientes;

async function atualiza(search = null){
  clientes = new Clientes(await service.getAll(search))
  view.update(clientes);

  document.querySelectorAll('td > button').forEach(element => {  
    element.addEventListener('click', async(e)=>{
      try{
        const response = await service.delete(element.getAttribute("data-id"));
        alert(response);
      }catch(e){      
        alert(e.response.data.message);
      }
      
      atualiza();
    })
  });
}

document.querySelector('form').addEventListener('submit', async(e) => {
  e.preventDefault();

  const nome = document.querySelector('#name').value;
  const telefone = document.querySelector('#telefone').value;
  const email = document.querySelector('#email').value;

  const response = await service.add(new Cliente(nome, telefone, email));
  alert(response);

  atualiza();
});

document.querySelector("#search").addEventListener('input', e => {
  atualiza(e.target.value);
})

atualiza();