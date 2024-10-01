import Router from 'express';
import ProdutosController from '../controllers/ProdutosController.js';
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js'
import verifyUserAuthorization from '../middlewares/verifyUserAuthorization.js';

const produtosRouter = Router();
const produtosController = new ProdutosController();

produtosRouter.use(ensureAuthenticated);
produtosRouter.use(verifyUserAuthorization(['admin', 'user']));

produtosRouter.post("/", produtosController.create);
produtosRouter.get("/", produtosController.index);
produtosRouter.get("/:id", produtosController.show);
produtosRouter.delete("/:id", produtosController.delete);
produtosRouter.patch("/:id", produtosController.update);

export default produtosRouter;
