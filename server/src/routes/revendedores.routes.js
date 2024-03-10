import { Router } from "express";
import RevendedoresController from "../controllers/RevendedoresController.js";

const revendedoresRouter = new Router();
const revendedoresController = new RevendedoresController();

revendedoresRouter.post("/", revendedoresController.create);
revendedoresRouter.get("/", revendedoresController.index);
revendedoresRouter.get("/:id", revendedoresController.show);
revendedoresRouter.delete("/:id", revendedoresController.delete);
revendedoresRouter.patch("/:id", revendedoresController.update);

export default revendedoresRouter;

