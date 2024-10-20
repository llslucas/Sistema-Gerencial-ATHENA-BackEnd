import UserRepository from "../repositories/UserRepository.js";
import SessionCreateService from "../services/sessions/SessionCreateService.js";

export class SessionsController{
    async create(request, response){
        const { email, password } = request.body;

        const userRepository = new UserRepository();
        const sessionCreateService = new SessionCreateService(userRepository);

        const { user, token } = await sessionCreateService.execute({email, password});

        response.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
    
        const responseUser = {
            name: user.name,
            email: user.email,
            isAdmin: user.role === "admin"
        };
    
        return response.status(201).json({ user: responseUser });        
    }
}