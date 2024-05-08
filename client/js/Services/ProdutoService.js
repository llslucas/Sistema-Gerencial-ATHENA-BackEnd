import { api } from "./api.js";
import { Produto } from "../Model/Produto/Produto.js";

export class ProdutoService{   
    /**
     * @param {string} query 
     * @return {Produto[]}
     */
    async getAll(query=null){
        const response = await api.get("/produtos", {
            params:{
                nome: query
            }
        });         
        const produtos = response.data.map(obj => new Produto(obj.nome, obj.descricao, obj.categoria, obj.tamanho, obj.estoque_atual, obj.created_at, obj.updated_at, obj.id));    
        return produtos;
    }

    /**
     * @param {number} id
     * @return {Produto}
     */
    async get(id){  
        const response = await api.get("/produtos/" + id);  
        const {nome, descricao, categoria, tamanho, estoque_atual, created_at, updated_at} = response.data;
        const produto = new Produto(nome, descricao, categoria, tamanho, estoque_atual, created_at, updated_at, id);        
        return produto;
    }

    /**
     * @param {Produto} produto
     * @return {string}
     */
    async add(produto){   
        const response = await api.post("/produtos", produto.info());
        return response.data;
    }

    /**
     * @param {number} id
     * @return {string}
     */
    async delete(id){
        const response = await api.delete("/produtos/" + id);
        return response.data;
    }

    /**
     * @param {number} id
     * @param {Produto} produto
     * @return {string}
     */
    async atualiza(id, produto){
        const response = await api.patch("/produtos/" + id, produto.info());
        return response.data;
    }
}