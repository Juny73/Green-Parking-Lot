const router = require('express').Router();
const Espacio = require('../models/espacio.model');

router.get('/', async (req, res) => {
  let disp = { auto: { disponibles: 0, total: 0 }, moto: { disponibles: 0, total: 0 } };
  try { disp = await Espacio.resumen(); } catch (e) { console.error('Sin conexión a la BD:', e.message); }
  res.render('index', { titulo: 'Inicio', disp });
});

router.get('/quienes-somos', (req, res) => res.render('quienesSomos', { titulo: 'Quiénes somos' }));
router.get('/servicios', (req, res) => res.render('servicios', { titulo: 'Servicios' }));
router.get('/contacto', (req, res) => res.render('contacto', { titulo: 'Contacto' }));

router.post('/contacto', (req, res) => {
  const { nombre, correo, mensaje } = req.body;
  if (!nombre || !correo || !mensaje) {
    return res.status(400).render('contacto', { titulo: 'Contacto', errores: ['Completa todos los campos.'], datos: req.body });
  }
  // Aquí se puede guardar en BD o enviar por correo (nodemailer)
  req.session.mensaje = { tipo: 'ok', texto: 'Mensaje recibido. Te responderemos pronto.' };
  res.redirect('/contacto');
});

module.exports = router;
