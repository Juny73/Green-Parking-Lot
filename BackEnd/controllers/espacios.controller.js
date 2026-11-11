const Espacio = require('../models/espacio.model');

const flash = (req, tipo, texto) => { req.session.mensaje = { tipo, texto }; };

exports.celdas = async (req, res) => {
  const espacios = await Espacio.listar();
  res.render('operador/celdas', { titulo: 'Celdas', espacios });
};

exports.cambiarEstado = async (req, res) => {
  const { estado } = req.body;
  if (!['disponible', 'ocupado', 'reservado', 'mantenimiento'].includes(estado)) {
    flash(req, 'error', 'Estado no válido.');
    return res.redirect('/operador/celdas');
  }
  await Espacio.cambiarEstado(req.params.id, estado);
  flash(req, 'ok', 'Celda actualizada.');
  res.redirect('/operador/celdas');
};
