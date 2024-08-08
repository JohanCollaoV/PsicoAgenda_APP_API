import express from 'express';
import { connection } from "../../db/db.js";

const router = express.Router();

router.get('/messages', async (req, res) => {
  const { SenderId, ReceiverId } = req.query;

  try {
    const [rows] = await connection.query(
      `SELECT * FROM Mensajes WHERE (SenderId = ? AND ReceiverId = ?) OR (SenderId = ? AND ReceiverId = ?) ORDER BY Timestamp`,
      [SenderId, ReceiverId, ReceiverId, SenderId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('message', async (msg) => {
      try {
        const { SenderId, ReceiverId, Mensaje } = msg;

        // Insertar el mensaje en la base de datos
        const [result] = await connection.query(
          `INSERT INTO Mensajes (SenderId, ReceiverId, Mensaje) VALUES (?, ?, ?)`,
          [SenderId, ReceiverId, Mensaje]
        );

        // Obtener el nombre del remitente
        const [rows] = await connection.query(
          `SELECT CONCAT(p.PrimerNombre, ' ', p.SegundoNombre, ' ', p.ApellidoPaterno, ' ', p.ApellidoMaterno) AS Nombre
          FROM Persona p 
          INNER JOIN Usuario u ON p.IdPersona = u.IdPersona
          WHERE u.IdUsuario = ?`,
          [SenderId]
        );

        const senderName = rows.length > 0 ? rows[0].Nombre : `Usuario ${SenderId}`;
        const newMessage = { IdMensaje: result.insertId, SenderId, ReceiverId, Mensaje, Timestamp: new Date(), senderName };
        
        io.emit('message', newMessage);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

export default router;