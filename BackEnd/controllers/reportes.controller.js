// Administración: usuarios y reportes
const db = require('../config/db');
const Usuario = require('../models/usuario.model');

const flash = (req, tipo, texto) => { req.session.mensaje = { tipo, texto }; };

exports.usuarios = async (req, res) => {
  const usuarios = await Usuario.listar();
  res.render('admin/usuarios', { titulo: 'Usuarios', usuarios });
};

exports.cambiarEstado = async (req, res) => {
  const estado = req.body.estado === 'activo' ? 'activo' : 'inactivo';
  if (Number(req.params.id) === req.session.usuario.id) {
    flash(req, 'error', 'No puedes cambiar el estado de tu propia cuenta.');
    return res.redirect('/admin/usuarios');
  }
  await Usuario.cambiarEstado(req.params.id, estado);
  flash(req, 'ok', `Usuario ${estado === 'activo' ? 'activado' : 'desactivado'}.`);
  res.redirect('/admin/usuarios');
};

exports.crearOperador = async (req, res) => {
  const bcrypt = require('bcrypt');
  const d = req.body;
  if (!d.numero_documento || !d.nombre || !d.correo || !d.celular || !d.contrasena || d.contrasena.length < 6) {
    flash(req, 'error', 'Completa todos los campos. La contraseña debe tener al menos 6 caracteres.');
    return res.redirect('/admin/usuarios');
  }
  if (await Usuario.existe(d.numero_documento, d.correo)) {
    flash(req, 'error', 'Ya existe un usuario con ese documento o correo.');
    return res.redirect('/admin/usuarios');
  }
  d.tipo_documento = d.tipo_documento || 'CC';
  d.contrasena = await bcrypt.hash(d.contrasena, 10);
  await Usuario.crear(d, d.rol === 'administrador' ? 'administrador' : 'operador');
  flash(req, 'ok', 'Usuario creado.');
  res.redirect('/admin/usuarios');
};

exports.reportes = async (req, res) => {
  const [[ocupacion]] = await db.query(
    "SELECT COUNT(*) AS total, SUM(estado = 'ocupado') AS ocupadas, SUM(estado = 'reservado') AS reservadas FROM espacios"
  );
  const [[hoy]] = await db.query(
    'SELECT COUNT(*) AS entradas, COALESCE(SUM(f.total), 0) AS recaudo FROM ingresos_salidas i LEFT JOIN facturas f ON f.ingreso_salida_id = i.id WHERE DATE(i.hora_entrada) = CURDATE()'
  );
  const [frecuentes] = await db.query(
    `SELECT v.placa, v.tipo, COUNT(*) AS visitas FROM ingresos_salidas i JOIN vehiculos v ON v.id = i.vehiculo_id
     GROUP BY v.id ORDER BY visitas DESC LIMIT 5`
  );
  const [celdasTop] = await db.query(
    `SELECT e.codigo, COUNT(*) AS usos FROM ingresos_salidas i JOIN espacios e ON e.id = i.espacio_id
     GROUP BY e.id ORDER BY usos DESC LIMIT 5`
  );
  const [horas] = await db.query(
    'SELECT HOUR(hora_entrada) AS hora, COUNT(*) AS entradas FROM ingresos_salidas GROUP BY hora ORDER BY entradas DESC LIMIT 5'
  );
  const [movimientos] = await db.query(
    `SELECT i.*, v.placa, f.total FROM ingresos_salidas i JOIN vehiculos v ON v.id = i.vehiculo_id
     LEFT JOIN facturas f ON f.ingreso_salida_id = i.id ORDER BY i.hora_entrada DESC LIMIT 20`
  );
  res.render('admin/reportes', { titulo: 'Reportes', ocupacion, hoy, frecuentes, celdasTop, horas, movimientos });
};
