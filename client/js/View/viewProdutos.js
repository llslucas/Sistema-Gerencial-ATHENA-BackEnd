import { View } from "./View"
import { Produtos } from "../Model/Produto/Produtos"

export class viewProdutos extends View{  
    /** 
    *@param {Produtos} model
    */
    template(model){
        return `
        <table class="table table-hover table-bordered">
            <thead>
                <tr>
                    <th class="text-center">Nome</th>
                    <th class="text-center">Descrição</th>
                    <th class="text-center">Categoria</th>
                    <th class="text-center">Tamanho</th>
                    <th class="text-center">Estoque Atual</th>
                    <th class="text-center">Excluir</th>
                </tr>
            </thead>
            
            <tbody>
                ${model.paraArray().map(produto => 
                    `
                    <tr>                        
                        <td> ${produto.nome}</td>
                        <td> ${produto.descricao}</td>
                        <td class="text-center"> ${produto.categoria}</td>
                        <td class="text-center"> ${produto.tamanho}</td>
                        <td class="text-center"> ${produto.estoque_atual}</td> 
                        <td class="text-center"><button class="btn btn-danger" data-id="${produto.id}"> Excluir </button></td>                      
                    </tr>
                    `).join('')}
            </tbody> 
                       
        </table> 
        `   
    }


}