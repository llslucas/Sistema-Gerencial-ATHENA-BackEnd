import { api } from "./api";
import { Revendedor } from "../Model/Revendedor/Revendedor";

export class RevendedorService{   
    /**
     * @param {string} query 
     * @return {Revendedor[]}
     */
    async getAll(query=null){
        const response = await api.get("/revendedores", {
            params:{
                nome: query
            }
        });         

        const revendedores = response.data.map(obj => new Revendedor(obj.nome, obj.contato, obj.comissao, obj.created_at, obj.updated_at, obj.id));    
        return revendedores;
    }

    /**
     * @param {number} id
     * @return {Revendedor}
     */
    async get(id){  
        const response = await api.get("/revendedores/" + id);  
        const {nome, contato, comissao, created_at, updated_at} = response.data;
        const produto = new Revendedor(nome, contato, comissao, created_at, updated_at, id);        
        return produto;
    }

    /**
     * @param {Revendedor} revendedor
     * @return {string}
     */
    async add(revendedor){   
        const response = await api.post("/revendedores", revendedor.info());
        return response.data;
    }

    /**
     * @param {number} id
     * @return {string}
     */
    async delete(id){
        const response = await api.delete("/revendedores/" + id);
        return response.data;
    }

    /**
     * @param {number} id
     * @param {Revendedor} revendedor
     * @return {string}
     */
    async atualiza(id, revendedor){
        const response = await api.patch("/revendedores/" + id, revendedor.info());
        return response.data;
    }
}