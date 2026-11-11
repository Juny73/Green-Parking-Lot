const db = require('../config/db');

exports.porUsuario = async (usuarioId) => {
  const [f] = await db.query(
    `SELECT r.*, e.codigo, e.tipo FROM reservas r
     JOIN espacios e ON e.id = r.espacio_id
     WHERE r.usuario_id = ? ORDER BY r.fecha_reserva DESC`, [usuarioId]);
  return f;
};

exports.crear = async ({ usuario_id, espacio_id, fecha_reserva }) => {
  const [r] = await db.query(
    "INSERT INTO reservas (usuario_id, parqueadero_id, espacio_id, fecha_reserva, estado) VALUES (?, 1, ?, ?, 'confirmada')",
    [usuario_id, espacio_id, fecha_reserva]
  );
  return r.insertId;
};

exports.obtener = async (id) => {
  const [f] = await db.query('SELECT * FROM reservas WHERE id = ?', [id]);
  return f[0];
};

exports.cancelar = async (id) => {
  await db.query("UPDATE reservas SET estado = 'cancelada' WHERE id = ?", [id]);
};
