// Uso: npm run crear-admin
// Crea el administrador inicial (documento 1000000000, contraseña Admin123*)
require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../config/db");

(async () => {
  try {
    const [roles] = await db.query("SELECT id FROM roles WHERE nombre = \"administrador\"");
    if (!roles.length) throw new Error("Importa primero database/ajustes.sql");
    const hash = await bcrypt.hash("Admin123*", 10);
    await db.query(
      `INSERT INTO usuarios (tipo_documento, numero_documento, nombre, correo, celular, contrasena, rol_id)
       VALUES (\"CC\", \"1000000000\", \"Administrador\", \"admin@greenparking.com\", \"3000000000\", ?, ?)
       ON DUPLICATE KEY UPDATE contrasena = VALUES(contrasena)`,
      [hash, roles[0].id]
    );
    console.log("Administrador listo -> documento: 1000000000 | contraseña: Admin123*");
  } catch (e) {
    console.error(e.message);
  } finally {
    process.exit();
  }
})();
