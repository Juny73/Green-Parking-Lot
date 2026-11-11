const db = require("../config/db");

// Devuelve el último dígito numérico de la placa (o null si no tiene)
function ultimoDigito(placa) {
  const m = String(placa).match(/\d(?!.*\d)/);
  return m ? Number(m[0]) : null;
}

// true si la placa tiene restricción hoy
async function tieneRestriccion(placa, fecha = new Date()) {
  const digito = ultimoDigito(placa);
  if (digito === null) return false;
  const [filas] = await db.query(
    "SELECT id FROM restricciones WHERE dia_semana = ? AND ultimo_digito = ?",
    [fecha.getDay(), digito]
  );
  return filas.length > 0;
}

module.exports = { ultimoDigito, tieneRestriccion };
