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
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Tamanho</th>
                    <th>Estoque Atual</th>
                </tr>
            </thead>
            
            <tbody>
                ${model.paraArray().map(produto => 
                    `
                    <tr>                        
                        <td> ${produto.nome}</td>
                        <td> R$ ${produto.descricao}</td>
                        <td> R$ ${produto.categoria}</td>
                        <td> R$ ${produto.tamanho}</td>
                        <td> R$ ${produto.estoque_atual}</td>                     
                    </tr>
                    `).join('')}
            </tbody> 
                       
        </table> 
        `   
    }


}