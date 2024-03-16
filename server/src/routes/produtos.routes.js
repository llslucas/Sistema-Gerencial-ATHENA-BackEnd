import Router from 'express';
import ProdutosController from '../controllers/ProdutosController.js';

const produtosRouter = Router();
const produtosController = new ProdutosController();

produtosRouter.post("/", produtosController.create);
produtosRouter.get("/", produtosController.index);
produtosRouter.get("/:id", produtosController.show);
produtosRouter.delete("/:id", produtosController.delete);
produtosRouter.patch("/:id", produtosController.update);

export default produtosRouter;
