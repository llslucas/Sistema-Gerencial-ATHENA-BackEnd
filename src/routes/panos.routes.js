import Router from 'express';
import PanosController from '../controllers/PanosController.js';
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js';
import verifyUserAuthorization from '../middlewares/verifyUserAuthorization.js';
import validarCampos from '../middlewares/validarCampos.js';

const panosRouter = Router();
const panosController = new PanosController();

panosRouter.use(ensureAuthenticated);
panosRouter.use(verifyUserAuthorization(['admin', 'user']));
panosRouter.use(validarCampos(["id_produto", "quantidade", "valor_venda"], "itens"))

panosRouter.post("/", validarCampos(["id_revendedor", "observacoes", "itens"]), panosController.create);
panosRouter.get("/", panosController.index);
panosRouter.get("/:id", panosController.show);
panosRouter.delete("/:id", panosController.delete);
panosRouter.patch("/:id", panosController.update);

export default panosRouter;
