import Router from 'express';
import ComprasController from '../controllers/ComprasController.js';

const comprasRouter = Router();
const comprasController = new ComprasController();

comprasRouter.post("/", comprasController.create);
comprasRouter.get("/", comprasController.index);
comprasRouter.get("/:id", comprasController.show);
comprasRouter.delete("/:id", comprasController.delete);
comprasRouter.patch("/:id", comprasController.update);

export default comprasRouter;
