import { Router } from "express";
import {insertarPsicologo, get_psicologos, actualizarPsicologo, 
    datos_psicologo, horas_psicologo, citas_psicologo, 
    historial_psicologo, atenciones_psicologo, traerEspecialidad, 
    especialidades, buscarPsicologos} from "../controller/psicologo.controller.js";

const router = Router();


router.get('/psicologos/get_psicologos', get_psicologos);

router.get('/psicologos/buscar_psicologos', buscarPsicologos);

router.get('/psicologos/datos_psicologo', datos_psicologo);

router.get('/psicologos/horas_psicologo', horas_psicologo);


router.post('/usuarios/registro_psicologo', insertarPsicologo);

router.post('/psicologos/patch_psicologo', actualizarPsicologo);

router.get('/psicologos/get_citas_psicologo', citas_psicologo);

router.get('/psicologos/get_historial_psicologo', historial_psicologo);

router.get('/psicologos/get_atenciones_psicologo', atenciones_psicologo);

router.get('/psicologos/especialidad', traerEspecialidad);

router.get('/psicologos/allEspecialidades', especialidades);




export default router