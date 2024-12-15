const express = require("express");
const morgan = require("morgan");
const logger = require("./middlewares/logger");
const joyasRoutes = require("./routes/joyas");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(logger);

// Rutas
app.use("/joyas", joyasRoutes);

// Middleware para rutas no existentes
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
