import AppError from "../utils/AppError.js";

/**
 * 
 * @param  {[]} campos 
 * @returns 
 */
export default function validarCampos(campos, propriedade = null, propriedadeObrigatoria = false){
  return (request, response, next) => {

    if(propriedade && propriedadeObrigatoria){
      for(const campo of campos){
        if(!Object.hasOwn(request.body[propriedade], campo)){
          throw new AppError(`O Campo ${campo} da propriedade ${propriedade} não foi especificado.`, 404);        
        }
      }
    }  
    
    if(propriedade && !propriedadeObrigatoria){
      if(Object.hasOwn(request.body, propriedade)){
        for(const campo of campos){  
          if(Array.isArray(request.body[propriedade])){
            let i = 0;
            for(const obj of request.body[propriedade]){
              i++;
              if(!Object.hasOwn(obj, campo)){
                throw new AppError(`O Campo ${campo} do item ${i} do array ${propriedade} não foi especificado.`, 404);        
              }
            }
          }else{
            if(!Object.hasOwn(request.body[propriedade], campo)){
              throw new AppError(`O Campo ${campo} da propriedade ${propriedade} não foi especificado.`, 404);        
            }
          }          
        }
      }
    } 

    if(!propriedade){
      for(const campo of campos){
        if(!Object.hasOwn(request.body, campo)){
          throw new AppError(`O Campo ${campo} não foi especificado.`, 404);        
        }
      }
    }    

    return next();
  }
}