const router = require('express').Router();
const reportes = require('../controllers/reportes.controller');
const facturas = require('../controllers/facturas.controller');
const { permitirRoles } = require('../middlewares/roles');

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

router.use(permitirRoles('administrador'));
router.get('/reportes', wrap(reportes.reportes));
router.get('/usuarios', wrap(reportes.usuarios));
router.post('/usuarios', wrap(reportes.crearOperador));
router.post('/usuarios/:id/estado', wrap(reportes.cambiarEstado));
router.get('/tarifas', wrap(facturas.tarifas));
router.post('/tarifas/:id', wrap(facturas.actualizarTarifa));

module.exports = router;
