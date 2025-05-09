const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 5000;

const dbConfig = {
  host: process.env.DB_HOST || "mysql",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "testdb",
  port: process.env.DB_PORT || 3306,
};

app.get("/", async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM personas");
    let html = "<h1>Personas</h1><ul>";
    rows.forEach((persona) => {
      html += `<li>${persona.id}: ${persona.nombre}</li>`;
    });
    html += "</ul>";
    res.send(html);
  } catch (err) {
    res.status(500).send("Error conectando a la base de datos: " + err.message);
  } finally {
    if (connection) await connection.end();
  }
});

app.listen(PORT, () => {
  console.log(`App corriendo en http://localhost:${PORT}`);
});
