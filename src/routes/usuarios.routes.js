import { Router } from "express";
import { obtenerIdUsuario, traerUsuarios, cambiarContrasena, 
    eliminarUsuario, loginUsuario, insertarUsuario, getDetallesCitas, 
    getDetallesCitasById, getProximaCitaById, datosPersona, 
    saveToken, mantendorBuscar, mantendorUsuario, traerComunas, 
    comunas, citasAsignadas,
    idChat} from "../controller/usuarios.controller.js";

const router = Router();

router.get('/usuarioooo', traerUsuarios);

// Ruta para consultar inicio de sesión
router.get('/usuarios/login', loginUsuario);

router.get('/usuarios/comuna', traerComunas);
router.get('/usuarios/todasLasComunas', comunas);


// Ruta para crear un nuevo usuario
router.post('/usuarios/registro_usuario', insertarUsuario);

router.get('/usuarios/cambiar_contrasena', cambiarContrasena);

router.delete('/usuarios/elimina_rusuario', eliminarUsuario);

router.get('/usuarios/get_citas', getDetallesCitas);

router.get('/usuarios/get_citas_by_id', getDetallesCitasById);

router.get('/usuarios/get_proxima_cita_by_id', getProximaCitaById);

router.get('/usuarios/citas_asignadas', citasAsignadas);

router.get('/usuarios/obtener_id', obtenerIdUsuario);

router.get('/usuarios/datosPaciente', datosPersona);

router.get('/usuarios/guadarToken', saveToken);

router.get('/admin/buscarCita', mantendorBuscar);

router.get('/admin/buscarUsuario', mantendorUsuario);

router.get('/usuarios/datosChat', idChat);


export default router;
