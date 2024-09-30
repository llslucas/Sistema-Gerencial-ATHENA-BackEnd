import Router from 'express';

import clientesRouter from './clientes.routes.js';
import revendedoresRouter from './revendedores.routes.js';
import produtosRouter from './produtos.routes.js';
import panosRouter from './panos.routes.js';
import comprasRouter from './compras.routes.js';
import movimentacoesRouter from './movimentacoes.routes.js';
import vendasRouter from './vendas.routes.js';
import usersRouter from './users.routes.js';
import sessionsRouter from './sessions.routes.js';

const router = Router();

router.use('/clientes', clientesRouter);
router.use('/revendedores', revendedoresRouter);
router.use('/produtos', produtosRouter);
router.use('/panos', panosRouter);
router.use('/compras', comprasRouter);
router.use('/movimentacoes', movimentacoesRouter);
router.use('/vendas', vendasRouter);
router.use('/users', usersRouter);
router.use('/sessions', sessionsRouter);

export default router;