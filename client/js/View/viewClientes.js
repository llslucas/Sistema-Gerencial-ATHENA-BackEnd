import { View } from "./View"
import { Clientes } from "../Model/Cliente/Clientes"

export class ViewClientes extends View{  
    /** 
    *@param {Clientes} model
    */
    template(model){
        return `
        <table class="table table-hover table-bordered">
            <thead>
                <tr>
                    <th class="text-center">ID</th>
                    <th class="text-center">Nome</th>
                    <th class="text-center">Telefone</th>
                    <th class="text-center">E-mail</th>       
                    <th class="text-center">Exluir</th>             
                </tr>
            </thead>
            
            <tbody>
                ${model.paraArray().map(cliente => 
                    `
                    <tr>                        
                        <td class="text-center"> ${cliente.id}</td>
                        <td> ${cliente.nome}</td>
                        <td> ${cliente.telefone}</td>
                        <td> ${cliente.email}</td>          
                        <td class="text-center"><button class="btn btn-danger" data-id="${cliente.id}"> Excluir </button></td>                               
                    </tr>
                    `).join('')}
            </tbody> 
                       
        </table> 
        `   
    }


}