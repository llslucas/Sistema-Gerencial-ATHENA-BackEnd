import Router from 'express';

import UsersController from '../controllers/UsersController.js';
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js'
import validarCampos from '../middlewares/validarCampos.js';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post("/", validarCampos(["name", "email", "password"]), usersController.create);
usersRouter.patch("/", ensureAuthenticated, usersController.update);
usersRouter.get("/", ensureAuthenticated, usersController.index);
usersRouter.delete("/:id", ensureAuthenticated, usersController.delete);
usersRouter.get("/validate", ensureAuthenticated, usersController.validate);

export default usersRouter;
