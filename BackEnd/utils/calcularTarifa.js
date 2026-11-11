const db = require("../config/db");

// Cobra por hora o fracción usando la tarifa "hora" del tipo de vehículo
async function calcularTarifa(tipoVehiculo, horaEntrada, horaSalida) {
  const [filas] = await db.query(
    "SELECT precio FROM tarifas WHERE tipo_vehiculo = ? AND tiempo = \"hora\" LIMIT 1",
    [tipoVehiculo]
  );
  const precioHora = filas.length ? Number(filas[0].precio) : 0;
  const minutos = Math.max(1, Math.ceil((new Date(horaSalida) - new Date(horaEntrada)) / 60000));
  const horas = Math.ceil(minutos / 60);
  return { horas, minutos, total: horas * precioHora };
}

module.exports = { calcularTarifa };
