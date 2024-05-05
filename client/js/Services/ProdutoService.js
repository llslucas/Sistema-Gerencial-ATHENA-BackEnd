import { api } from "./api.js";
import { Produto } from "../Model/Produto/Produto.js";

export class ProdutoService{   
    /**
     * @return {Produto[]}
     */
    async getProdutos(){
        const response = await api.get("/produtos");         
        const produtos = response.data.map(obj => new Produto(obj.nome, obj.descricao, obj.categoria, obj.tamanho, obj.estoque_atual, obj.created_at, obj.updated_at, obj.id,));    
        return produtos;
    }

    /**
     * @param {number} id
     * @return {Produto}
     */
    async getProduto(id){  
        const response = await api.get("/produtos/" + id);  
        const {nome, descricao, categoria, tamanho, estoque_atual, created_at, updated_at} = response.data;
        const produto = new Produto(nome, descricao, categoria, tamanho, estoque_atual, created_at, updated_at, id);        
        return produto;
    }

    /**
     * @param {Produto} produto
     * @return {string}
     */
    async addProduto(produto){   
        const response = await api.post("/produtos", produto.info());
        return response.data;
    }

    async deleteProduto(id){
        const response = await api.delete("/produtos/" + id);
        return response.data;
    }


}