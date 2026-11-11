const router = require('express').Router();
const ingresos = require('../controllers/ingresos.controller');
const espacios = require('../controllers/espacios.controller');
const incidentes = require('../controllers/incidentes.controller');
const { permitirRoles } = require('../middlewares/roles');

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

router.use(permitirRoles('operador', 'administrador'));
router.get('/ingresos', wrap(ingresos.ver));
router.post('/ingresos/entrada', wrap(ingresos.entrada));
router.post('/ingresos/salida', wrap(ingresos.salida));
router.get('/celdas', wrap(espacios.celdas));
router.post('/celdas/:id', wrap(espacios.cambiarEstado));
router.get('/incidencias', wrap(incidentes.ver));
router.post('/incidencias', wrap(incidentes.crear));

module.exports = router;
