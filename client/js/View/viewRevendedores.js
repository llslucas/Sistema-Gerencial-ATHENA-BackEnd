import { View } from "./View"
import { Revendedores } from "../Model/Revendedor/Revendedores"

export class ViewRevendedores extends View{  
    /** 
    *@param {Revendedores} model
    */
    template(model){
        return `
        <table class="table table-hover table-bordered">
            <thead>
                <tr>
                    <th class="text-center">ID</th>
                    <th class="text-center">Nome</th>
                    <th class="text-center">Contato</th>
                    <th class="text-center">Comissão</th>       
                    <th class="text-center">Exluir</th>             
                </tr>
            </thead>
            
            <tbody>
                ${model.paraArray().map(revendedor => 
                    `
                    <tr>                        
                        <td class="text-center">${revendedor.id}</td>
                        <td>${revendedor.nome}</td>
                        <td>${revendedor.contato}</td>
                        <td class="text-center">${revendedor.comissao}</td>          
                        <td class="text-center"><button class="btn btn-danger" data-id="${revendedor.id}"> Excluir </button></td>                               
                    </tr>
                    `).join('')}
            </tbody> 
                       
        </table> 
        `   
    }
}