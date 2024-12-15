# Tienda de Joyas API REST

## Descripción
Esta es una API REST desarrollada en Node.js con Express y PostgreSQL que permite gestionar un inventario de joyas. La API incluye rutas para listar joyas con paginación, ordenar los resultados, y filtrar por diferentes atributos como precio, categoría y tipo de metal.

---

## Requisitos previos

1. **Node.js** (v14 o superior)
2. **PostgreSQL** (v12 o superior)
3. Tener una base de datos llamada `joyas` configurada con la tabla `inventario`.

---

## Instalación

### 1. Clona el repositorio
```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd joyas-api
```

### 2. Instala las dependencias
```bash
npm install
```

### 3. Configura las variables de entorno
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=joyas
DB_PASSWORD=tu_contraseña
DB_PORT=5432
PORT=3000
```
Asegúrate de cambiar los valores según tu configuración local.

### 4. Inicializa la base de datos
Crea la tabla `inventario` en la base de datos `joyas` con el siguiente script SQL:
```sql
CREATE TABLE inventario (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  precio NUMERIC,
  categoria VARCHAR(50),
  metal VARCHAR(50)
);
```

Opcionalmente, inserta datos de ejemplo:
```sql
INSERT INTO inventario (nombre, precio, categoria, metal)
VALUES
  ('Anillo de oro', 1200, 'anillos', 'oro'),
  ('Collar de plata', 800, 'collares', 'plata'),
  ('Pulsera de platino', 1500, 'pulseras', 'platino');
```

---

## Estructura del proyecto
```
joyas-api/
├── config/
│   └── database.js      # Configuración de la conexión a PostgreSQL
├── middlewares/
│   └── logger.js        # Middleware para registrar consultas
├── routes/
│   └── joyas.js         # Rutas para joyas
├── .env                 # Variables de entorno
├── app.js               # Configuración principal de Express
├── package.json         # Configuración del proyecto
└── README.md            # Documentación del proyecto
```

---

## Uso

### Inicia el servidor
```bash
# Iniciar el servidor con Node.js
node app.js

# O iniciar con nodemon (si lo instalaste)
npx nodemon app.js
```

El servidor estará disponible en `http://localhost:3000`.

---

## Endpoints disponibles

### **GET /joyas**
Obtiene una lista de joyas con soporte para paginación y ordenamiento.

#### Query Params:
| Parámetro  | Descripción                             | Valor por defecto |
|-------------|-----------------------------------------|-------------------|
| `limits`    | Cantidad de resultados por página        | 5                 |
| `page`      | Número de la página                    | 1                 |
| `order_by`  | Campo y dirección para ordenar (ej: `precio_DESC`) | `id_ASC`           |

#### Ejemplo de respuesta:
```json
{
  "total": 50,
  "page": 1,
  "per_page": 5,
  "results": [
    {
      "id": 1,
      "nombre": "Anillo de oro",
      "precio": 1200,
      "categoria": "anillos",
      "metal": "oro"
    }
  ],
  "links": {
    "self": "/joyas?limits=5&page=1&order_by=id_ASC",
    "next": "/joyas?limits=5&page=2&order_by=id_ASC",
    "prev": null
  }
}
```

---

### **GET /joyas/filtros**
Filtra las joyas por precio, categoría o tipo de metal.

#### Query Params:
| Parámetro     | Descripción                      |
|----------------|----------------------------------|
| `precio_min`   | Precio mínimo                   |
| `precio_max`   | Precio máximo                   |
| `categoria`    | Categoría de la joya            |
| `metal`        | Tipo de metal                   |

#### Ejemplo de respuesta:
```json
[
  {
    "id": 1,
    "nombre": "Anillo de oro",
    "precio": 1200,
    "categoria": "anillos",
    "metal": "oro"
  }
]
```

---

## Middleware

### **Logger**
Registra en la consola cada consulta realizada al servidor:
```javascript
const logger = (req, res, next) => {
  console.log(`Consulta realizada a la ruta: ${req.path}`);
  next();
};
```
