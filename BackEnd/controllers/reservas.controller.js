// Panel del usuario: reservas y vehículos propios
const Espacio = require('../models/espacio.model');
const Reserva = require('../models/reserva.model');
const Vehiculo = require('../models/vehiculo.model');
const Ingreso = require('../models/ingreso.model');

const flash = (req, tipo, texto) => { req.session.mensaje = { tipo, texto }; };

exports.panel = async (req, res) => {
  const id = req.session.usuario.id;
  const [espacios, vehiculos, reservas, historial] = await Promise.all([
    Espacio.listar(), Vehiculo.porUsuario(id), Reserva.porUsuario(id), Ingreso.historialPorUsuario(id)
  ]);
  res.render('usuario/panel', { titulo: 'Mi panel', espacios, vehiculos, reservas, historial });
};

exports.verReservas = async (req, res) => {
  const id = req.session.usuario.id;
  const [vehiculos, reservas] = await Promise.all([Vehiculo.porUsuario(id), Reserva.porUsuario(id)]);
  res.render('usuario/reservas', { titulo: 'Mis reservas', vehiculos, reservas });
};

exports.crearReserva = async (req, res) => {
  const usuarioId = req.session.usuario.id;
  const vehiculos = await Vehiculo.porUsuario(usuarioId);
  const vehiculo = vehiculos.find(v => String(v.id) === String(req.body.vehiculo_id));
  const fecha = new Date(req.body.fecha_reserva);

  if (!vehiculo) {
    flash(req, 'error', 'Elige uno de tus vehículos. Si no tienes, regístralo primero.');
    return res.redirect('/usuario/reservas');
  }
  if (isNaN(fecha) || fecha < new Date()) {
    flash(req, 'error', 'Elige una fecha y hora futuras.');
    return res.redirect('/usuario/reservas');
  }
  const espacio = await Espacio.primeroDisponible(vehiculo.tipo);
  if (!espacio) {
    flash(req, 'error', 'No hay celdas disponibles para ese tipo de vehículo.');
    return res.redirect('/usuario/reservas');
  }
  await Reserva.crear({ usuario_id: usuarioId, espacio_id: espacio.id, fecha_reserva: req.body.fecha_reserva });
  await Espacio.cambiarEstado(espacio.id, 'reservado');
  flash(req, 'ok', `Reserva confirmada en la celda ${espacio.codigo}.`);
  res.redirect('/usuario/reservas');
};

exports.cancelarReserva = async (req, res) => {
  const r = await Reserva.obtener(req.params.id);
  if (!r || r.usuario_id !== req.session.usuario.id) {
    flash(req, 'error', 'No encontramos esa reserva.');
    return res.redirect('/usuario/reservas');
  }
  await Reserva.cancelar(r.id);
  await Espacio.cambiarEstado(r.espacio_id, 'disponible');
  flash(req, 'ok', 'Reserva cancelada.');
  res.redirect('/usuario/reservas');
};

exports.verVehiculos = async (req, res) => {
  const vehiculos = await Vehiculo.porUsuario(req.session.usuario.id);
  res.render('usuario/vehiculos', { titulo: 'Mis vehículos', vehiculos });
};

exports.crearVehiculo = async (req, res) => {
  const placa = String(req.body.placa || '').trim().toUpperCase();
  const tipo = req.body.tipo === 'moto' ? 'moto' : 'auto';
  if (!/^[A-Z0-9]{5,7}$/.test(placa)) {
    flash(req, 'error', 'La placa no es válida. Usa de 5 a 7 letras o números, sin espacios.');
    return res.redirect('/usuario/vehiculos');
  }
  if (await Vehiculo.porPlaca(placa)) {
    flash(req, 'error', 'Esa placa ya está registrada.');
    return res.redirect('/usuario/vehiculos');
  }
  await Vehiculo.crear({ placa, tipo, color: req.body.color, marca: req.body.marca, modelo: req.body.modelo, usuario_id: req.session.usuario.id });
  flash(req, 'ok', `Vehículo ${placa} registrado.`);
  res.redirect('/usuario/vehiculos');
};
