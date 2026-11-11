const router = require('express').Router();
const c = require('../controllers/auth.controller');
const { requiereLogin, soloInvitados } = require('../middlewares/auth');
const { reglasLogin, reglasRegistro, revisar } = require('../middlewares/validar');

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

router.get('/login', soloInvitados, c.verLogin);
router.post('/login', reglasLogin, revisar('auth/login', 'Iniciar sesión'), wrap(c.login));
router.get('/registro', soloInvitados, c.verRegistro);
router.post('/registro', reglasRegistro, revisar('auth/registro', 'Crear cuenta'), wrap(c.registro));
router.get('/destino', requiereLogin, c.destino);
router.get('/logout', c.logout);

module.exports = router;
