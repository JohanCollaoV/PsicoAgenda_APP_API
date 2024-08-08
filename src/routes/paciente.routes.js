import { Router } from "express";
import { get_pacientes, insertarPaciente, actualizarPaciente, updateCita, 
    finalizarCita, borrarCita, insertarCitas } from "../controller/paciente.controller.js";


const router = Router();

router.get('/usuarios/get_pacientes', get_pacientes);


router.post('/usuarios/insertar_paciente', insertarPaciente);

router.post('/usuarios/patch_paciente', actualizarPaciente);

router.get('/paciente/agendarCita', updateCita);
router.get('/paciente/finalizarCita', finalizarCita);

router.get('/paciente/borrarCita', borrarCita);
router.get('/paciente/insertarCitas', insertarCitas);



export default router