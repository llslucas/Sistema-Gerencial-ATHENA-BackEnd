import { viewProdutos } from "../View/viewProdutos";
import { Produto } from "../Model/Produto/Produto";
import { Produtos } from "../Model/Produto/Produtos";
import { Service } from "../Services/Service";
import { getExceptionMessage } from "../../utils/ApplicationException";

export class ProdutoController{
    constructor(){     
        this._view = new viewProdutos('#app');
        this._service = new Service('produtos', Produto);        
        this._produtos = new Produtos();        
        this._search = document.querySelector('#search');
        this._init();
    }

    async _init(){
        this._search.addEventListener('input', event => this.atualiza()); 
        this.atualiza();
    }

    async atualiza(){
        this._produtos.renew(await this._service.getAll(this._search.value));          
        this._view.update(this._produtos);        

        //Insere função delete nas linhas.
        document.querySelectorAll('td > button').forEach(element => {  
            element.addEventListener('click', (e)=>{             
                this.delete(element);
            })
        });
    }

    async cadastra(){
        const nome = document.querySelector('#name').value;
        const descricao = document.querySelector('#descricao').value;
        const categoria = document.querySelector('#categoria').value;
        const tamanho = document.querySelector('#tamanho').value;
        const estoque_atual = document.querySelector('#estoque').value;

        const response = await this._service.add(new Produto({nome, descricao, categoria, tamanho, estoque_atual}));         
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