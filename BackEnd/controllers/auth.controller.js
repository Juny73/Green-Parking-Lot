const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario.model');

const flash = (req, tipo, texto) => { req.session.mensaje = { tipo, texto }; };

exports.verLogin = (req, res) => res.render('auth/login', { titulo: 'Iniciar sesión' });
exports.verRegistro = (req, res) => res.render('auth/registro', { titulo: 'Crear cuenta' });

exports.login = async (req, res) => {
  const { numero_documento, contrasena } = req.body;
  const u = await Usuario.buscarPorDocumento(numero_documento);
  const valido = u && await bcrypt.compare(contrasena, u.contrasena);
  if (!valido) {
    return res.status(401).render('auth/login', { titulo: 'Iniciar sesión', errores: ['Documento o contraseña incorrectos.'], datos: req.body });
  }
  if (u.estado !== 'activo') {
    return res.status(403).render('auth/login', { titulo: 'Iniciar sesión', errores: ['Tu cuenta está inactiva. Comunícate con el administrador.'], datos: req.body });
  }
  req.session.usuario = { id: u.id, nombre: u.nombre, rol: u.rol };
  res.redirect('/auth/destino');
};

exports.registro = async (req, res) => {
  const d = req.body;
  if (await Usuario.existe(d.numero_documento, d.correo)) {
    return res.status(409).render('auth/registro', { titulo: 'Crear cuenta', errores: ['Ya existe una cuenta con ese documento o correo.'], datos: d });
  }
  d.contrasena = await bcrypt.hash(d.contrasena, 10);
  await Usuario.crear(d, 'usuario'); // rol por defecto
  flash(req, 'ok', 'Cuenta creada. Ya puedes iniciar sesión.');
  res.redirect('/auth/login');
};

// Lleva a cada rol a su panel
exports.destino = (req, res) => {
  const rol = req.session.usuario.rol;
  const destinos = { administrador: '/admin/reportes', operador: '/operador/ingresos', usuario: '/usuario/panel' };
  res.redirect(destinos[rol] || '/');
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
