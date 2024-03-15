import Router from 'express';
import PanosController from '../controllers/PanosController.js';

const panosRouter = Router();
const panosController = new PanosController();

panosRouter.post("/", panosController.create);
panosRouter.get("/", panosController.index);
panosRouter.get("/:id", panosController.show);
panosRouter.delete("/:id", panosController.delete);
panosRouter.patch("/:id", panosController.update);

export default panosRouter;
