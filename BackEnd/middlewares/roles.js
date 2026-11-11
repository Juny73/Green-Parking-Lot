function permitirRoles(...roles) {
  return (req, res, next) => {
    const u = req.session.usuario;
    if (!u) {
      req.session.mensaje = { tipo: "error", texto: "Inicia sesión para continuar." };
      return res.redirect("/auth/login");
    }
    if (!roles.includes(u.rol)) {
      req.session.mensaje = { tipo: "error", texto: "No tienes permiso para entrar a esa sección." };
      return res.redirect("/auth/destino");
    }
    next();
  };
}

module.exports = { permitirRoles };
