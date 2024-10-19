import Router from 'express';
import VendasController from '../controllers/VendasController.js';
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js';
import verifyUserAuthorization from '../middlewares/verifyUserAuthorization.js';
import validarCampos from '../middlewares/validarCampos.js';

const vendasRouter = Router();
const vendasController = new VendasController();

vendasRouter.use(ensureAuthenticated);
vendasRouter.use(verifyUserAuthorization(['admin', 'user']));
vendasRouter.use(validarCampos(["id", "quantidade", "valor_unitario", "valor_total", "valor_comissao"], "itens"));

vendasRouter.post("/", validarCampos(["tipo_pagamento", "data_venda", "id_revendedor", "id_cliente", "itens"]), vendasController.create);
vendasRouter.get("/", vendasController.index);
vendasRouter.get("/:id", vendasController.show);
vendasRouter.delete("/:id", vendasController.delete);
vendasRouter.patch("/:id", vendasController.update);

export default vendasRouter;
