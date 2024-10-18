import Router from 'express';
import ComprasController from '../controllers/ComprasController.js';
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js'
import verifyUserAuthorization from '../middlewares/verifyUserAuthorization.js';
import atualizarEstoque from '../middlewares/atualizarEstoque.js';

const comprasRouter = Router();
const comprasController = new ComprasController();

comprasRouter.use(ensureAuthenticated);
comprasRouter.use(verifyUserAuthorization(['admin', 'user']));

comprasRouter.post("/", comprasController.create);
comprasRouter.get("/", comprasController.index);
comprasRouter.get("/:id", comprasController.show);
comprasRouter.delete("/:id", comprasController.delete);
comprasRouter.patch("/:id", comprasController.update);

export default comprasRouter;
