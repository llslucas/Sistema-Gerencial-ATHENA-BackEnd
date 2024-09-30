import Router from 'express';
import ClientesController from '../controllers/ClientesController.js';
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js'
import verifyUserAuthorization from '../middlewares/verifyUserAuthorization.js';

const clientesRouter = Router();
const clientesController = new ClientesController();

clientesRouter.use(ensureAuthenticated);
clientesRouter.use(verifyUserAuthorization(['admin', 'user']));

clientesRouter.post("/", clientesController.create);
clientesRouter.get("/", clientesController.index);
clientesRouter.get("/:id", clientesController.show);
clientesRouter.delete("/:id", clientesController.delete);
clientesRouter.patch("/:id", clientesController.update);

export default clientesRouter;
