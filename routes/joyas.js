const express = require("express");
const pool = require("../config/database");
const router = express.Router();

// Ruta GET /joyas
router.get("/", async (req, res) => {
  try {
    const { limits = 5, page = 1, order_by = "id_ASC" } = req.query;
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits;

    const query = `SELECT * FROM inventario ORDER BY ${campo} ${direccion} LIMIT $1 OFFSET $2`;
    const values = [parseInt(limits), parseInt(offset)];
    const { rows } = await pool.query(query, values);

    const countQuery = "SELECT COUNT(*) FROM inventario";
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      total,
      page: parseInt(page),
      per_page: parseInt(limits),
      results: rows,
      links: {
        self: `/joyas?limits=${limits}&page=${page}&order_by=${order_by}`,
        next: page * limits < total ? `/joyas?limits=${limits}&page=${parseInt(page) + 1}&order_by=${order_by}` : null,
        prev: page > 1 ? `/joyas?limits=${limits}&page=${parseInt(page) - 1}&order_by=${order_by}` : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las joyas" });
  }
});

// Ruta GET /joyas/filtros
router.get("/filtros", async (req, res) => {
  try {
    const { precio_min, precio_max, categoria, metal } = req.query;
    const filters = [];
    const values = [];

    if (precio_min) {
      filters.push("precio >= $1");
      values.push(precio_min);
    }
    if (precio_max) {
      filters.push(`precio <= $${values.length + 1}`);
      values.push(precio_max);
    }
    if (categoria) {
      filters.push(`categoria = $${values.length + 1}`);
      values.push(categoria);
    }
    if (metal) {
      filters.push(`metal = $${values.length + 1}`);
      values.push(metal);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
    const query = `SELECT * FROM inventario ${whereClause}`;
    const { rows } = await pool.query(query, values);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al filtrar las joyas" });
  }
});

module.exports = router;
