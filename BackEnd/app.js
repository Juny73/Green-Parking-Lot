require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../FrontEnd/views'));

app.use(express.static(path.join(__dirname, '../FrontEnd/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

// Variables disponibles en todas las vistas Pug
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  res.locals.ruta = req.path;
  res.locals.fecha = (d) => d ? new Date(d).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
  res.locals.dinero = (n) => '$' + Number(n || 0).toLocaleString('es-CO');
  res.locals.mensaje = req.session.mensaje || null;
  delete req.session.mensaje;
  next();
});

app.use('/', require('./routes/public.routes'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/usuario', require('./routes/usuario.routes'));
app.use('/operador', require('./routes/operador.routes'));
app.use('/admin', require('./routes/admin.routes'));

app.use((req, res) => {
  res.status(404).render('index', { titulo: 'Página no encontrada', noEncontrada: true, disp: { auto: 0, moto: 0 } });
});

app.use((err, req, res, next) => {
  console.error(err);
  req.session.mensaje = { tipo: 'error', texto: 'Ocurrió un error inesperado. Intenta de nuevo.' };
  res.redirect(req.get('Referer') || '/');
});

module.exports = app;
