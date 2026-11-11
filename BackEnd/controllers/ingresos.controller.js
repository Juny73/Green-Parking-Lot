const Ingreso = require('../models/ingreso.model');
const Vehiculo = require('../models/vehiculo.model');
const Espacio = require('../models/espacio.model');
const { tieneRestriccion } = require('../utils/picoYPlaca');
const { calcularTarifa } = require('../utils/calcularTarifa');
const facturas = require('./facturas.controller');

const flash = (req, tipo, texto) => { req.session.mensaje = { tipo, texto }; };
const placaValida = (p) => /^[A-Z0-9]{5,7}$/.test(p);

exports.ver = async (req, res) => {
  const activos = await Ingreso.activos();
  res.render('operador/ingresos', { titulo: 'Ingresos y salidas', activos });
};

exports.entrada = async (req, res) => {
  const placa = String(req.body.placa || '').trim().toUpperCase();
  const tipo = req.body.tipo === 'moto' ? 'moto' : 'auto';

  if (!placaValida(placa)) {
    flash(req, 'error', 'La placa no es válida. Usa de 5 a 7 letras o números, sin espacios.');
    return res.redirect('/operador/ingresos');
  }
  if (await tieneRestriccion(placa)) {
    flash(req, 'error', `Ingreso negado: la placa ${placa} tiene pico y placa hoy.`);
    return res.redirect('/operador/ingresos');
  }
  if (await Ingreso.activoPorPlaca(placa)) {
    flash(req, 'error', `El vehículo ${placa} ya está dentro del parqueadero.`);
    return res.redirect('/operador/ingresos');
  }
  const espacio = await Espacio.primeroDisponible(tipo);
  if (!espacio) {
    flash(req, 'error', 'No hay celdas disponibles para ese tipo de vehículo.');
    return res.redirect('/operador/ingresos');
  }

  let vehiculo = await Vehiculo.porPlaca(placa);
  const vehiculoId = vehiculo ? vehiculo.id : await Vehiculo.crear({ placa, tipo });

  await Ingreso.registrarEntrada(vehiculoId, espacio.id);
  await Espacio.cambiarEstado(espacio.id, 'ocupado');
  flash(req, 'ok', `Entrada registrada: ${placa} en la celda ${espacio.codigo}.`);
  res.redirect('/operador/ingresos');
};

exports.salida = async (req, res) => {
  const placa = String(req.body.placa || '').trim().toUpperCase();
  const activo = await Ingreso.activoPorPlaca(placa);
  if (!activo) {
    flash(req, 'error', `No hay una entrada activa para la placa ${placa}.`);
    return res.redirect('/operador/ingresos');
  }
  const finalizado = await Ingreso.registrarSalida(activo.id);
  const t = await calcularTarifa(activo.tipo, finalizado.hora_entrada, finalizado.hora_salida);
  await facturas.generar(activo.id, t.total, req.body.metodo_pago);
  await Espacio.cambiarEstado(activo.espacio_id, 'disponible');
  flash(req, 'ok', `Salida registrada: ${placa}. ${t.horas} h cobradas, total $${t.total.toLocaleString('es-CO')}.`);
  res.redirect('/operador/ingresos');
};
