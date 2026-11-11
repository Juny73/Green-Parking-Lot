const db = require('../config/db');

const SELECT_BASE = `SELECT u.*, r.nombre AS rol FROM usuarios u JOIN roles r ON r.id = u.rol_id`;

exports.buscarPorDocumento = async (documento) => {
  const [f] = await db.query(`${SELECT_BASE} WHERE u.numero_documento = ?`, [documento]);
  return f[0];
};

exports.existe = async (documento, correo) => {
  const [f] = await db.query('SELECT id FROM usuarios WHERE numero_documento = ? OR correo = ?', [documento, correo]);
  return f.length > 0;
};

exports.crear = async (d, rolNombre = 'usuario') => {
  const [r] = await db.query('SELECT id FROM roles WHERE nombre = ?', [rolNombre]);
  const [res] = await db.query(
    `INSERT INTO usuarios (tipo_documento, numero_documento, nombre, correo, celular, contrasena, rol_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [d.tipo_documento, d.numero_documento, d.nombre, d.correo, d.celular, d.contrasena, r[0].id]
  );
  return res.insertId;
};

exports.listar = async () => {
  const [f] = await db.query(`${SELECT_BASE} ORDER BY u.id DESC`);
  return f;
};

exports.cambiarEstado = async (id, estado) => {
  await db.query('UPDATE usuarios SET estado = ? WHERE id = ?', [estado, id]);
};
