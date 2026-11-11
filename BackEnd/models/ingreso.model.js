const db = require('../config/db');

exports.activos = async () => {
  const [f] = await db.query(
    `SELECT i.*, v.placa, v.tipo, e.codigo FROM ingresos_salidas i
     JOIN vehiculos v ON v.id = i.vehiculo_id
     JOIN espacios e ON e.id = i.espacio_id
     WHERE i.estado = 'activo' ORDER BY i.hora_entrada DESC`);
  return f;
};

exports.activoPorPlaca = async (placa) => {
  const [f] = await db.query(
    `SELECT i.*, v.placa, v.tipo FROM ingresos_salidas i
     JOIN vehiculos v ON v.id = i.vehiculo_id
     WHERE v.placa = ? AND i.estado = 'activo' LIMIT 1`, [placa]);
  return f[0];
};

exports.registrarEntrada = async (vehiculoId, espacioId) => {
  const [r] = await db.query(
    "INSERT INTO ingresos_salidas (vehiculo_id, parqueadero_id, espacio_id, hora_entrada, estado) VALUES (?, 1, ?, NOW(), 'activo')",
    [vehiculoId, espacioId]
  );
  return r.insertId;
};

exports.registrarSalida = async (id) => {
  await db.query("UPDATE ingresos_salidas SET hora_salida = NOW(), estado = 'finalizado' WHERE id = ?", [id]);
  const [f] = await db.query('SELECT * FROM ingresos_salidas WHERE id = ?', [id]);
  return f[0];
};

exports.historialPorUsuario = async (usuarioId) => {
  const [f] = await db.query(
    `SELECT i.*, v.placa, fa.total FROM ingresos_salidas i
     JOIN vehiculos v ON v.id = i.vehiculo_id
     LEFT JOIN facturas fa ON fa.ingreso_salida_id = i.id
     WHERE v.usuario_id = ? ORDER BY i.hora_entrada DESC LIMIT 10`, [usuarioId]);
  return f;
};
