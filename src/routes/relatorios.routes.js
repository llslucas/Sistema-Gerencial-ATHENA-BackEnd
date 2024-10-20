import Router from 'express';
import RelatoriosController from '../controllers/RelatoriosController.js';

import ensureAuthenticated from '../middlewares/ensureAuthenticated.js'
import verifyUserAuthorization from '../middlewares/verifyUserAuthorization.js';

const relatoriosRouter = Router();

const relatoriosController = new RelatoriosController();

// relatoriosRouter.use(ensureAuthenticated);
// relatoriosRouter.use(verifyUserAuthorization(['admin', 'user']));

relatoriosRouter.get("/vendas", relatoriosController.relatorioVendas);

export default relatoriosRouter;