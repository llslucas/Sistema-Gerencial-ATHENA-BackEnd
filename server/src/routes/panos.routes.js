import Router from 'express';
import PanosController from '../controllers/PanosController.js';
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js';
import verifyUserAuthorization from '../middlewares/verifyUserAuthorization.js';

const panosRouter = Router();
const panosController = new PanosController();

panosRouter.use(ensureAuthenticated);
panosRouter.use(verifyUserAuthorization(['admin', 'user']));

panosRouter.post("/", panosController.create);
panosRouter.get("/", panosController.index);
panosRouter.get("/:id", panosController.show);
panosRouter.delete("/:id", panosController.delete);
panosRouter.patch("/:id", panosController.update);

export default panosRouter;
