function requiereLogin(req, res, next) {
  if (!req.session.usuario) {
    req.session.mensaje = { tipo: "error", texto: "Inicia sesión para continuar." };
    return res.redirect("/auth/login");
  }
  next();
}

function soloInvitados(req, res, next) {
  if (req.session.usuario) return res.redirect("/auth/destino");
  next();
}

module.exports = { requiereLogin, soloInvitados };
