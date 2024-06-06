import { ViewClientes } from "../View/Tabelas/viewClientes";
import { Cliente } from "../Model/Cliente/Cliente";
import { Clientes } from "../Model/Cliente/Clientes";
import { Service } from "../Services/Service";
import { getExceptionMessage } from "../utils/ApplicationException";
import { ModalClientes } from "../View/Modais/ModalClientes";

export class ClienteController{
    constructor(){     
        this._view = new ViewClientes('#app');
        this._service = new Service('clientes', Cliente);        
        this._clientes = new Clientes();        
        this._search = document.querySelector('#search');
        this._modal = new ModalClientes();
        this._init();
    }
   
    async _init(){
        this._search.addEventListener('input', event => this.atualiza()); 
        document.querySelector("#open-modal").addEventListener('click', e => this.showModalCadastro());
        this.atualiza();
    }

    async atualiza(){
        this._clientes.renew(await this._service.getAll(this._search.value));          
        this._view.update(this._clientes); 

        //Insere função delete nas linhas.
        document.querySelectorAll('td > button#btn-delete').forEach(element => {  
            element.addEventListener('click', (e)=>{             
                this.delete(element);
            })
        });

        //Insere função visualizar nas linhas.
        document.querySelectorAll('td > button#btn-see').forEach(element => {  
            element.addEventListener('click', (e)=>{             
                this.showModalVisualizar(element);
            })
        });

        //Insere função atualizar nas linhas.
        document.querySelectorAll('td > button#btn-edit').forEach(element => {  
            element.addEventListener('click', (e)=>{             
                this.showModalEditar(element);
            })
        });
    }

    async cadastra(){
        const nome = document.querySelector('#nome').value;
        const telefone = document.querySelector('#telefone').value;
        const email = document.querySelector('#email').value;

        const response = await this._service.add(new Cliente({nome, telefone, email}));
        alert(response);

        this.atualiza();
        this._modal.hide();
    }    

    async atualizaObjeto(){
        const id = document.querySelector('#id').value;
        const nome = document.querySelector('#nome').value;
        const telefone = document.querySelector('#telefone').value;
        const email = document.querySelector('#email').value;

        const response = await this._service.atualiza(id, new Cliente({nome, telefone, email}));
        alert(response);

        this.atualiza();
        this._modal.hide();
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

    _showModal(readOnly = false){
        if(readOnly)
            this._modal.showReadOnly(); 
        else{
            this._modal.show();   
        }     

        document.querySelector("#close-modal").addEventListener('click', e => {
            this._modal.hide();
        });
    }    

    showModalCadastro(){
        this._showModal();
        document.querySelector("form").addEventListener('submit', e => {
            e.preventDefault();
            this.cadastra();
        });
    }

    async showModalVisualizar(element){        
        const cliente = await this._service.get(element.getAttribute("data-id"));
        this._showModal(true);
        this._modal.preencheCampos(cliente);
    }

    async showModalEditar(element){
        const cliente = await this._service.get(element.getAttribute("data-id"));
        this._showModal();
        this._modal.preencheCampos(cliente);
        document.querySelector("form").addEventListener('submit', e => {
            e.preventDefault();
            this.atualizaObjeto();
        });
    }
}