const { body, validationResult } = require("express-validator");

const reglasRegistro = [
  body("tipo_documento").isIn(["CC", "CE", "TI", "PAS"]).withMessage("Selecciona el tipo de documento."),
  body("numero_documento").trim().matches(/^[0-9]{5,15}$/).withMessage("El número de documento debe tener entre 5 y 15 dígitos."),
  body("nombre").trim().isLength({ min: 3 }).withMessage("Escribe tu nombre completo."),
  body("correo").trim().isEmail().withMessage("Escribe un correo válido."),
  body("celular").trim().matches(/^[0-9]{10}$/).withMessage("El celular debe tener 10 dígitos."),
  body("contrasena").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres.")
];

const reglasLogin = [
  body("numero_documento").trim().notEmpty().withMessage("Escribe tu número de documento."),
  body("contrasena").notEmpty().withMessage("Escribe tu contraseña.")
];

// Si hay errores, vuelve al formulario con los mensajes
function revisar(vista, titulo) {
  return (req, res, next) => {
    const errores = validationResult(req);
    if (errores.isEmpty()) return next();
    res.status(400).render(vista, { titulo, errores: errores.array().map(e => e.msg), datos: req.body });
  };
}

module.exports = { reglasRegistro, reglasLogin, revisar };
