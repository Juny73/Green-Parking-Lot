const router = require('express').Router();
const c = require('../controllers/reservas.controller');
const { permitirRoles } = require('../middlewares/roles');

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

router.use(permitirRoles('usuario', 'administrador', 'operador'));
router.get('/panel', wrap(c.panel));
router.get('/reservas', wrap(c.verReservas));
router.post('/reservas', wrap(c.crearReserva));
router.post('/reservas/:id/cancelar', wrap(c.cancelarReserva));
router.get('/vehiculos', wrap(c.verVehiculos));
router.post('/vehiculos', wrap(c.crearVehiculo));

module.exports = router;
