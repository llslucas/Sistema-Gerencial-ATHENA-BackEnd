import { api } from "./api";
import { Cliente } from "../Model/Cliente/Cliente";

export class ClienteService{
    /**
     * @param {string} query 
     * @return {Cliente[]}
     */
    async getClientes(query=null){
        const response = await api.get("/clientes", {
            params:{
                nome: query
            }
        });         
        const clientes = response.data.map(obj => new Cliente(obj.nome, obj.telefone, obj.email, obj.created_at, obj.updated_at, obj.id));    
        return clientes;
    }

    /**
     * @param {number} id
     * @return {Cliente}
     */
    async getCliente(id){  
        const response = await api.get("/clientes/" + id);  
        const {nome, telefone, email, created_at, updated_at} = response.data;
        const cliente = new Cliente(nome, telefone, email, created_at, updated_at, id);        
        return cliente;
    }

    /**
     * @param {Produto} cliente
     * @return {string}
     */
    async addCliente(cliente){   
        const response = await api.post("/clientes", cliente.info());
        return response.data;
    }

    /**
     * @param {number} id
     * @return {string}
     */
    async deleteCliente(id){
        const response = await api.delete("/clientes/" + id);
        return response.data;
    }
}