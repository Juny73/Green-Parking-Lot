const db = require('../config/db');

exports.listar = async () => {
  const [f] = await db.query('SELECT * FROM espacios ORDER BY piso, codigo');
  return f;
};

exports.primeroDisponible = async (tipo) => {
  const [f] = await db.query("SELECT * FROM espacios WHERE tipo = ? AND estado = 'disponible' ORDER BY piso, codigo LIMIT 1", [tipo]);
  return f[0];
};

exports.cambiarEstado = async (id, estado) => {
  await db.query('UPDATE espacios SET estado = ? WHERE id = ?', [estado, id]);
};

exports.resumen = async () => {
  const [f] = await db.query(
    "SELECT tipo, SUM(estado = 'disponible') AS disponibles, COUNT(*) AS total FROM espacios GROUP BY tipo"
  );
  const r = { auto: { disponibles: 0, total: 0 }, moto: { disponibles: 0, total: 0 } };
  f.forEach(x => { r[x.tipo] = { disponibles: Number(x.disponibles), total: Number(x.total) }; });
  return r;
};
