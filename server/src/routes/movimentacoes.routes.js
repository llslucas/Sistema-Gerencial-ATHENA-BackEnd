import Router from 'express';
import MovimentacoesController from '../controllers/MovimentacoesController.js';

const movimentacoesRouter = Router();
const movimentacoesController = new MovimentacoesController();

movimentacoesRouter.post("/", movimentacoesController.create);
movimentacoesRouter.get("/", movimentacoesController.index);
movimentacoesRouter.get("/:id", movimentacoesController.show);
movimentacoesRouter.delete("/:id", movimentacoesController.delete);
movimentacoesRouter.patch("/:id", movimentacoesController.update);

export default movimentacoesRouter;
