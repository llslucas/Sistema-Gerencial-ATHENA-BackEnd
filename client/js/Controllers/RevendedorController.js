import { ViewRevendedores } from "../View/Tabelas/viewRevendedores";
import { Revendedor } from "../Model/Revendedor/Revendedor";
import { Revendedores } from "../Model/Revendedor/Revendedores";
import { Service } from "../Services/Service";
import { getExceptionMessage } from "../utils/ApplicationException";
import { ModalRevendedores } from "../View/Modais/ModalRevendedores";

export class RevendedorController{
    constructor(){     
        this._view = new ViewRevendedores('#app');
        this._service = new Service('revendedores', Revendedor);        
        this._revendedores = new Revendedores();        
        this._search = document.querySelector('#search');
        this._modal = new ModalRevendedores();
        this._init();
    }

    async _init(){
        this._search.addEventListener('input', event => this.atualiza()); 
        document.querySelector("#open-modal").addEventListener('click', e => this.showModalCadastro());
        this.atualiza();
    }

    async atualiza(){
        this._revendedores.renew(await this._service.getAll(this._search.value));    
        this._view.update(this._revendedores);        

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
        const contato = document.querySelector('#contato').value;
        const comissao = document.querySelector('#comissao').value;

        const response = await this._service.add(new Revendedor({nome, contato, comissao}));
        alert(response);

        this.atualiza();
        this._modal.hide();
    }    

    async atualizaObjeto(){
        const id = document.querySelector('#id').value;
        const nome = document.querySelector('#nome').value;
        const contato = document.querySelector('#contato').value;
        const comissao = document.querySelector('#comissao').value;

        const response = await this._service.atualiza(id, new Revendedor({nome, contato, comissao}));
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
        const revendedor = await this._service.get(element.getAttribute("data-id"));
        this._showModal(true);
        this._modal.preencheCampos(revendedor);
    }

    async showModalEditar(element){
        const revendedor = await this._service.get(element.getAttribute("data-id"));
        this._showModal();
        this._modal.preencheCampos(revendedor);
        document.querySelector("form").addEventListener('submit', e => {
            e.preventDefault();
            this.atualizaObjeto();
        });
    }
}