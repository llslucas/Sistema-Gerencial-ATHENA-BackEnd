import Router from 'express';
import VendasController from '../controllers/VendasController.js';

const vendasRouter = Router();
const vendasController = new VendasController();

vendasRouter.post("/", vendasController.create);
vendasRouter.get("/", vendasController.index);
vendasRouter.get("/:id", vendasController.show);
vendasRouter.delete("/:id", vendasController.delete);
vendasRouter.patch("/:id", vendasController.update);

export default vendasRouter;
