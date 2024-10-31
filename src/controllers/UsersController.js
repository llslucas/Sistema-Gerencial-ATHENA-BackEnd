import UserRepository from '../repositories/UserRepository.js';
import UserCreateService from '../services/users/UserCreateService.js';
import UserDeleteService from '../services/users/UserDeleteService.js';
import UserSearchService from '../services/users/UserSearchService.js';
import UserUpdateService from '../services/users/UserUpdateService.js';
import AppError from '../utils/AppError.js';

export default class UsersController {
    async create(request, response){
        const { name, email, password } = request.body;      

        const userRepository = new UserRepository();

        const userCreateService = new UserCreateService(userRepository);
        await userCreateService.execute({ name, email, password });
        
        return response.status(201).json();        
    }

    async update(request, response){
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id;
        
        const userRepository = new UserRepository();

        const userUpdateService = new UserUpdateService(userRepository);
        
        await userUpdateService.execute({ user_id, name, email, password, old_password })

        return response.json("Usuário atualizado com sucesso!");
    }

    async search(request, response){
        const { search } = request.query;
        
        const userRepository = new UserRepository();
        const userSearchService = new UserSearchService(userRepository);

        await userSearchService.execute({ search });

        return response.json("Usuário alterado com sucesso!");
    }

    async delete(request, response){
        const { id } = request.params;

        const userRepository = new UserRepository();
        const userDeleteService = new UserDeleteService(userRepository);

        await userDeleteService.execute({ id });

        return response.json("Usuário excluído com sucesso!");
    }

    async validate(request, response){
        const id = request.user.id;

        const userRepository = new UserRepository();

        const checkUserExists = await userRepository.findById(id);

        if(!checkUserExists){
            throw new AppError("JWT token não informado", 401);
        }

        return response.status(200).json(true);
    }
}
