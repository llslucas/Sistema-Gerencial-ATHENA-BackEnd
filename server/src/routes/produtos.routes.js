import Router from 'express';
import ClientesController from '../controllers/ClientesController.js';

const produtosRouter = Router();
const produtosController = new ClientesController();

produtosRouter.post("/", produtosController.create);
produtosRouter.get("/", produtosController.index);
produtosRouter.get("/:id", produtosController.show);
produtosRouter.delete("/:id", produtosController.delete);
produtosRouter.patch("/:id", produtosController.update);

export default produtosRouter;
