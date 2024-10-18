import Router from 'express';
import MovimentacoesController from '../controllers/MovimentacoesController.js';
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js';
import verifyUserAuthorization from '../middlewares/verifyUserAuthorization.js';
import validarCampos from '../middlewares/validarCampos.js';

const movimentacoesRouter = Router();
const movimentacoesController = new MovimentacoesController();

movimentacoesRouter.use(ensureAuthenticated);
movimentacoesRouter.use(verifyUserAuthorization(['admin', 'user']));
movimentacoesRouter.use(validarCampos(["id", "tipo_movimentacao", "quantidade", "valor_unitario", "valor_total"], "itens"));

movimentacoesRouter.post("/", validarCampos(["descricao", "data_movimentacao", "itens"]), movimentacoesController.create);
movimentacoesRouter.get("/", movimentacoesController.index);
movimentacoesRouter.get("/:id",  movimentacoesController.show);
movimentacoesRouter.delete("/:id", movimentacoesController.delete);
movimentacoesRouter.patch("/:id", movimentacoesController.update);

export default movimentacoesRouter;