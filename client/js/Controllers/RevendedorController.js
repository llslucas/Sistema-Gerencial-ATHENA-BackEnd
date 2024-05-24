import { ViewRevendedores } from "../View/viewRevendedores";
import { Revendedor } from "../Model/Revendedor/Revendedor";
import { Revendedores } from "../Model/Revendedor/Revendedores";
import { Service } from "../Services/Service";
import { getExceptionMessage } from "../utils/ApplicationException";

export class RevendedorController{
    constructor(){     
        this._view = new ViewRevendedores('#app');
        this._service = new Service('revendedores', Revendedor);        
        this._revendedores = new Revendedores();        
        this._search = document.querySelector('#search');
        this._init();
    }

    async _init(){
        this._search.addEventListener('input', event => this.atualiza()); 
        this.atualiza();
    }

    async atualiza(){
        this._revendedores.renew(await this._service.getAll(this._search.value));    
        this._view.update(this._revendedores);        

        //Insere função delete nas linhas.
        document.querySelectorAll('td > button').forEach(element => {  
            element.addEventListener('click', (e)=>{             
                this.delete(element);
            })
        });
    }

    async cadastra(){
        const nome = document.querySelector('#name').value;
        const contato = document.querySelector('#contato').value;
        const comissao = document.querySelector('#comissao').value;

        const response = await this._service.add(new Revendedor({nome, contato, comissao}));
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