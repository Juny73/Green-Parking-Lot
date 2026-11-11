const db = require('../config/db');
const Vehiculo = require('../models/vehiculo.model');

const flash = (req, tipo, texto) => { req.session.mensaje = { tipo, texto }; };

exports.ver = async (req, res) => {
  const [incidentes] = await db.query(
    `SELECT i.*, v.placa FROM incidentes i LEFT JOIN vehiculos v ON v.id = i.vehiculo_id ORDER BY i.fecha DESC LIMIT 30`
  );
  res.render('operador/incidencias', { titulo: 'Incidencias', incidentes });
};

exports.crear = async (req, res) => {
  const { tipo, descripcion } = req.body;
  const placa = String(req.body.placa || '').trim().toUpperCase();
  if (!tipo || !descripcion || descripcion.trim().length < 5) {
    flash(req, 'error', 'Indica el tipo y describe lo ocurrido.');
    return res.redirect('/operador/incidencias');
  }
  let vehiculoId = null;
  if (placa) {
    const v = await Vehiculo.porPlaca(placa);
    if (!v) {
      flash(req, 'error', `La placa ${placa} no está registrada. Déjala vacía o regístrala primero.`);
      return res.redirect('/operador/incidencias');
    }
    vehiculoId = v.id;
  }
  await db.query(
    'INSERT INTO incidentes (parqueadero_id, vehiculo_id, tipo, descripcion) VALUES (1, ?, ?, ?)',
    [vehiculoId, tipo, descripcion.trim()]
  );
  flash(req, 'ok', 'Incidencia registrada.');
  res.redirect('/operador/incidencias');
};
