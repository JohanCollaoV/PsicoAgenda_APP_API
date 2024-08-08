import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import usuariosRoutes from './routes/usuarios.routes.js';
import psicologosRoutes from './routes/psicologo.routes.js';
import pacientesRoutes from './routes/paciente.routes.js';
import webpayController from './controller/webpay.controller.js';
import emailController from './controller/email.controller.js';
import messageController, { setupSocket } from './controller/message.controller.js';

// Crear la aplicación Express
const app = express();

// Crear el servidor HTTP
const server = http.createServer(app);

// Crear el servidor de Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
  },
  path: '/socket.io' // Asegúrate de tener esta línea
});

// Middleware para analizar el cuerpo de la solicitud en formato JSON
app.use(express.json());

// Middleware para permitir CORS
app.use(cors());

app.use('/api/v1/transbank', webpayController);
app.use('/api/v1/email', emailController);
app.use(usuariosRoutes);
app.use(psicologosRoutes);
app.use(pacientesRoutes);
app.use('/api/v1', messageController); // Asegúrate de que esta línea sea correcta

// Configurar el socket.io
setupSocket(io);

// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT;

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});