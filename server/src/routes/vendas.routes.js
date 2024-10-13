import Router from 'express';
import VendasController from '../controllers/VendasController.js';
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js';
import verifyUserAuthorization from '../middlewares/verifyUserAuthorization.js';

const vendasRouter = Router();
const vendasController = new VendasController();

vendasRouter.use(ensureAuthenticated);
vendasRouter.use(verifyUserAuthorization(['admin', 'user']));

vendasRouter.post("/", vendasController.create);
vendasRouter.get("/", vendasController.index);
vendasRouter.get("/:id", vendasController.show);
vendasRouter.delete("/:id", vendasController.delete);
vendasRouter.patch("/:id", vendasController.update);

export default vendasRouter;
