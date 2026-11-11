const db = require('../config/db');

exports.porUsuario = async (usuarioId) => {
  const [f] = await db.query('SELECT * FROM vehiculos WHERE usuario_id = ? ORDER BY id DESC', [usuarioId]);
  return f;
};

exports.porPlaca = async (placa) => {
  const [f] = await db.query('SELECT * FROM vehiculos WHERE placa = ?', [placa]);
  return f[0];
};

exports.crear = async ({ placa, tipo, color, marca, modelo, usuario_id }) => {
  const [r] = await db.query(
    'INSERT INTO vehiculos (placa, tipo, color, marca, modelo, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
    [placa, tipo, color || null, marca || null, modelo || null, usuario_id || null]
  );
  return r.insertId;
};
