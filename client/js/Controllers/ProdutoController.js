import { viewProdutos } from "../View/Tabelas/viewProdutos";
import { Produto } from "../Model/Produto/Produto";
import { Produtos } from "../Model/Produto/Produtos";
import { Service } from "../Services/Service";
import { getExceptionMessage } from "../utils/ApplicationException";
import { ModalProdutos } from "../View/Modais/ModalProdutos";

export class ProdutoController{
    constructor(){     
        this._view = new viewProdutos('#app');
        this._service = new Service('produtos', Produto);        
        this._produtos = new Produtos();        
        this._search = document.querySelector('#search');
        this._modal = new ModalProdutos();
        this._init();
    }

    async _init(){
        this._search.addEventListener('input', event => this.atualiza()); 
        document.querySelector("#open-modal").addEventListener('click', e => this.showModalCadastro());
        this.atualiza();
    }

    async atualiza(){
        this._produtos.renew(await this._service.getAll(this._search.value));          
        this._view.update(this._produtos);

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
        const descricao = document.querySelector('#descricao').value;
        const categoria = document.querySelector('#categoria').value;
        const tamanho = document.querySelector('#tamanho').value;
        const estoque_atual = document.querySelector('#estoque_atual').value;

        const response = await this._service.add(new Produto({nome, descricao, categoria, tamanho, estoque_atual}));         
        alert(response);

        this.atualiza();
    }    

    async atualizaObjeto(){
        const id = document.querySelector('#id').value;
        const nome = document.querySelector('#nome').value;
        const descricao = document.querySelector('#descricao').value;
        const categoria = document.querySelector('#categoria').value;
        const tamanho = document.querySelector('#tamanho').value;
        const estoque_atual = document.querySelector('#estoque_atual').value;

        const response = await this._service.atualiza(id, new Produto({nome, descricao, categoria, tamanho, estoque_atual}));
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