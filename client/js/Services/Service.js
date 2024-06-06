import { ApplicationException } from "../utils/ApplicationException";
import { api } from "./api";

export class Service{
    constructor(path, classe){
        this._path = path
        this._classe = classe
    }

    /**
     * @param {string} query 
     * @return {Object[]}
     */
    async getAll(query=null){
        const response = await api.get(`/${this._path}`, {
            params:{
                nome: query
            }
        });         
        
        const obj = response.data.map(obj => new this._classe(obj));    
        return obj;
    }

    /**
     * @param {number} id
     * @return {Object}
     */
    async get(id){  
        const response = await api.get(`/${this._path}/${id}`); 
        const obj = new this._classe(response.data);        
        return obj;
    }

    /**
     * @param {Object} obj
     * @return {string}
     */
    async add(obj){   
        const response = await api.post(`/${this._path}`, obj.info());
        return response.data;
    }

    /**
     * @param {number} id
     * @return {string}
     */
    async delete(id){
        try{
            const response = await api.delete(`/${this._path}/${id}`);
            return response.data;
        }catch(e){
            throw new ApplicationException("Não foi possível excluir o item, verifique as dependências.");
        }        
    }

    /**
     * @param {number} id
     * @param {Object} obj
     * @return {string}
     */
    async atualiza(id, obj){
        const response = await api.patch(`/${this._path}/${id}`, obj.info());
        return response.data;
    }
}