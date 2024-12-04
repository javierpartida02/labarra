const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 4000;
const mysql = require('mysql2');

// Middleware para parsear JSON
app.use(bodyParser.json());

// Middleware para servir archivos estáticos como CSS, JS, e imágenes
app.use(express.static(path.join(__dirname)));

// Configuración de MySQL 
const db = mysql.createConnection({ 
    host: 'localhost', 
    user: 'root',      // Reemplaza con tu usuario de MySQL 
    password: '1234',  // Reemplaza con tu contraseña de MySQL 
    database: 'restaurante' 
}); 
 
// Conectar a la base de datos 
db.connect(err => { 
    if (err) throw err; 
    console.log('Conectado a la base de datos MySQL'); 
}); 

// Ruta para la página principal
app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'main.html')); 
});

// Ruta para agregar pedido con múltiples platillos
app.post('/agregar-pedido', (req, res) => {
    const { nombre_cliente, direccion, correo, comentarios, platillos } = req.body;

    // Generar un código aleatorio único para el pedido
    const codigo = 'PED' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Insertar el pedido en la tabla `pedidos`
    const pedidoQuery = `INSERT INTO pedidos (codigo_pedido, nombre_cliente, direccion, correo, comentarios) VALUES (?, ?, ?, ?, ?)`;
    db.query(pedidoQuery, [codigo, nombre_cliente, direccion, correo, comentarios], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Hubo un problema al agregar el pedido' });
        }

        // Insertar cada platillo en la tabla `detalle_pedidos`
        const detalleQuery = `INSERT INTO detalle_pedidos (codigo_pedido, platillo, cantidad) VALUES ?`;
        const detalleValues = platillos.map(p => [codigo, p.platillo, p.cantidad]);

        db.query(detalleQuery, [detalleValues], (err) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Hubo un problema al agregar los detalles del pedido' });
            }
            res.status(200).json({ mensaje: 'Pedido agregado exitosamente, recuerda tu código:', codigo });
        });
    });
});

// Ruta para cancelar un pedido
app.post('/cancelar-pedido', (req, res) => {
    const { codigo } = req.body;

    // Verificar si el pedido existe
    const verificarPedidoQuery = `SELECT COUNT(*) AS count FROM pedidos WHERE codigo_pedido = ?`;
    db.query(verificarPedidoQuery, [codigo], (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Hubo un problema al verificar el pedido' });
        }

        const pedidoExiste = results[0].count > 0;

        if (!pedidoExiste) {
            // Si el pedido no existe, notificar al usuario
            return res.status(404).json({ error: 'El pedido no existe' });
        }

        // Eliminar los detalles del pedido primero
        const detalleQuery = `DELETE FROM detalle_pedidos WHERE codigo_pedido = ?`;
        db.query(detalleQuery, [codigo], (err) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Hubo un problema al cancelar los detalles del pedido' });
            }

            // Luego eliminar el pedido
            const pedidoQuery = `DELETE FROM pedidos WHERE codigo_pedido = ?`;
            db.query(pedidoQuery, [codigo], (err) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Hubo un problema al cancelar el pedido' });
                }
                res.status(200).json({ mensaje: 'Pedido cancelado exitosamente' });
            });
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:4000`);
});
