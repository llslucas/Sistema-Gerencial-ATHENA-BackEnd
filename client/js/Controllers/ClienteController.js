import { ViewClientes } from "../View/viewClientes";
import { Cliente } from "../Model/Cliente/Cliente";
import { Clientes } from "../Model/Cliente/Clientes";
import { Service } from "../Services/Service";
import { ApplicationException, getExceptionMessage } from "../../utils/ApplicationException";

export class ClienteController{
    constructor(){     
        this._view = new ViewClientes('#app');
        this._service = new Service('clientes', Cliente);        
        this._clientes = new Clientes();        
        this._search = document.querySelector('#search');
        this._init();
    }

    async _init(){
        this._search.addEventListener('input', event => this.atualiza()); 
        this.atualiza();
    }

    async atualiza(){
        this._clientes.renew(await this._service.getAll(this._search.value));          
        this._view.update(this._clientes);        

        //Insere função delete nas linhas.
        document.querySelectorAll('td > button').forEach(element => {  
            element.addEventListener('click', (e)=>{             
                this.delete(element);
            })
        });
    }

    async cadastra(){
        const nome = document.querySelector('#name').value;
        const telefone = document.querySelector('#telefone').value;
        const email = document.querySelector('#email').value;

        const response = await this._service.add(new Cliente({nome, telefone, email}));
        alert(response);

        this.atualiza();
    }    

    async delete(element){
        try{
            const response = await this._service.delete(element.getAttribute("data-id"));
            alert(response);
        }catch(e){      
            alert(getExceptionMessage(e));          
        }
        
        this.atualiza();
    }
}