import { Router } from "express";
import RevendedoresController from "../controllers/RevendedoresController.js";

import ensureAuthenticated from "../middlewares/ensureAuthenticated.js";
import verifyUserAuthorization from "../middlewares/verifyUserAuthorization.js";
import validarCampos from "../middlewares/validarCampos.js";

const revendedoresRouter = new Router();
const revendedoresController = new RevendedoresController();

revendedoresRouter.use(ensureAuthenticated);
revendedoresRouter.use(verifyUserAuthorization(['admin', 'user']));

revendedoresRouter.post("/", validarCampos(["nome", "contato", "comissao"]), revendedoresController.create);
revendedoresRouter.get("/", revendedoresController.index);
revendedoresRouter.get("/:id", revendedoresController.show);
revendedoresRouter.delete("/:id", revendedoresController.delete);
revendedoresRouter.patch("/:id", revendedoresController.update);

export default revendedoresRouter;

