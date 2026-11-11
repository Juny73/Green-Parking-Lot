const db = require('../config/db');

const flash = (req, tipo, texto) => { req.session.mensaje = { tipo, texto }; };

// Se usa al registrar una salida
exports.generar = async (ingresoId, total, metodoPago) => {
  const metodo = ['efectivo', 'tarjeta', 'transferencia'].includes(metodoPago) ? metodoPago : 'efectivo';
  await db.query('INSERT INTO facturas (ingreso_salida_id, total, metodo_pago) VALUES (?, ?, ?)', [ingresoId, total, metodo]);
};

exports.tarifas = async (req, res) => {
  const [tarifas] = await db.query('SELECT * FROM tarifas ORDER BY tipo_vehiculo, id');
  res.render('admin/tarifas', { titulo: 'Tarifas', tarifas });
};

exports.actualizarTarifa = async (req, res) => {
  const precio = Number(req.body.precio);
  if (!(precio >= 0)) {
    flash(req, 'error', 'Escribe un precio válido.');
    return res.redirect('/admin/tarifas');
  }
  await db.query('UPDATE tarifas SET precio = ? WHERE id = ?', [precio, req.params.id]);
  flash(req, 'ok', 'Tarifa actualizada.');
  res.redirect('/admin/tarifas');
};
