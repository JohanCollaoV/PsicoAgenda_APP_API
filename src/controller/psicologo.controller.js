import { connection } from "../../db/db.js";


export const get_psicologos = async (req, res) => {
    try {
        const [result] = await connection.query
            ("SELECT ps.IdPsicologo, " +
                "CONCAT(p.PrimerNombre, ' ', p.SegundoNombre, ' ', p.ApellidoPaterno, ' ', p.ApellidoMaterno) AS Nombre, " +
                "e.NombreEspecialidad, u.CorreoElectronico, ps.ValorSesion, ps.Descripcion FROM Psicologo ps " +
                "INNER JOIN Especialidad e ON ps.IdEspecialidad  = e.IdEspecialidad " +
                "INNER JOIN Usuario u ON ps.IdUsuario = u.IdUsuario INNER JOIN Persona p ON p.IdPersona = u.IdPersona");
        res.json(result);
    } catch (error) {
        console.error("Error al obtener Psicologos:", error);
        res.status(500).json({ message: "Error al obtener Psicologos." });
    }
};

export const buscarPsicologos = async (req, res) => {
    const { Criterio, Dato, Dato2 } = req.query;
    try {
        if (Criterio == 1) {
            const [result] = await connection.query(
                `SELECT ps.IdPsicologo,
                    CONCAT(p.PrimerNombre, ' ', p.SegundoNombre, ' ', p.ApellidoPaterno, ' ', p.ApellidoMaterno) AS Nombre, 
                    e.NombreEspecialidad, u.CorreoElectronico, ps.ValorSesion, ps.Descripcion FROM Psicologo ps
                    INNER JOIN Especialidad e ON ps.IdEspecialidad = e.IdEspecialidad 
                    INNER JOIN Usuario u ON ps.IdUsuario = u.IdUsuario INNER JOIN Persona p ON p.IdPersona = u.IdPersona
                    WHERE CONCAT(p.PrimerNombre, ' ', p.SegundoNombre, ' ', p.ApellidoPaterno, ' ', p.ApellidoMaterno) 
                    LIKE '%` + [Dato] + `%'`);
            res.json(result);
        } else if (Criterio == 2) {
            const [result] = await connection.query(
                `SELECT ps.IdPsicologo,
                    CONCAT(p.PrimerNombre, ' ', p.SegundoNombre, ' ', p.ApellidoPaterno, ' ', p.ApellidoMaterno) AS Nombre, 
                    e.NombreEspecialidad, u.CorreoElectronico, ps.ValorSesion, ps.Descripcion FROM Psicologo ps
                    INNER JOIN Especialidad e ON ps.IdEspecialidad = e.IdEspecialidad 
                    INNER JOIN Usuario u ON ps.IdUsuario = u.IdUsuario INNER JOIN Persona p ON p.IdPersona = u.IdPersona
                    WHERE e.NombreEspecialidad = ?`, [Dato]);
            res.json(result);
        } else if (Criterio == 3) {
            const [result] = await connection.query(
                `SELECT ps.IdPsicologo,
                    CONCAT(p.PrimerNombre, ' ', p.SegundoNombre, ' ', p.ApellidoPaterno, ' ', p.ApellidoMaterno) AS Nombre, 
                    e.NombreEspecialidad, u.CorreoElectronico, ps.ValorSesion, ps.Descripcion FROM Psicologo ps
                    INNER JOIN Especialidad e ON ps.IdEspecialidad = e.IdEspecialidad 
                    INNER JOIN Usuario u ON ps.IdUsuario = u.IdUsuario INNER JOIN Persona p ON p.IdPersona = u.IdPersona
                    WHERE CONCAT(p.PrimerNombre, ' ', p.SegundoNombre, ' ', p.ApellidoPaterno, ' ', p.ApellidoMaterno) 
                    LIKE '%` + [Dato] + `%' AND e.NombreEspecialidad = ?`, [Dato2]);
            res.json(result);      
        }
    } catch (error) {
        console.error("Error al buscar Psicologos:", error);
        res.status(500).json({ message: "Error al buscar Psicologos." });
    }
};

export const horas_psicologo = async (req, res) => {
    const { IdPsicologo, FechaCita } = req.query;
    try {
        const [result] = await connection.query
            ("SELECT c.IdCita, DATE_FORMAT(c.HoraCita, '%H:%i') as HoraCita FROM Cita c " +
                "WHERE c.IdPsicologo = ? AND " +
                "DATE_FORMAT(c.FechaCita, '%d-%m-%Y') = ? " +
                "AND c.IdEstadoCita = 3 " + 
                "ORDER BY c.HoraCita;",[IdPsicologo, FechaCita])
        res.json(result);
    } catch (error) {
        console.error("Error al obtener Horas:", error);
        res.status(500).json({ message: "Error al obtener Horas." });
    }
};


export const datos_psicologo = async (req, res) => {
    const { IdPsicologo } = req.query;
    try {
        const [result] = await connection.query
            ("SELECT ps.IdPsicologo, " +
                "CONCAT(p.PrimerNombre, ' ', p.SegundoNombre, ' ', p.ApellidoPaterno, ' ', p.ApellidoMaterno) AS Nombre, " +
                "e.NombreEspecialidad, u.CorreoElectronico, ps.ValorSesion, ps.Descripcion FROM Psicologo ps " +
                "INNER JOIN Especialidad e ON ps.IdEspecialidad  = e.IdEspecialidad " +
                "INNER JOIN Usuario u ON ps.IdUsuario = u.IdUsuario INNER JOIN Persona p ON p.IdPersona = u.IdPersona " +
                "WHERE ps.IdPsicologo = ?", [IdPsicologo]);
        res.json(result);
    } catch (error) {
        console.error("Error al obtener Psicologos:", error);
        res.status(500).json({ message: "Error al obtener Psicologos." });
    }
};


export const insertarPsicologo = async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const {
            Calle,
            Numero,
            IdComuna,
            PrimerNombre,
            SegundoNombre,
            ApellidoPaterno,
            ApellidoMaterno,
            Telefono,
            FechaNacimiento,
            CorreoElectronico,
            Contrasena,
            IdTipoUsuario,
            Rut,
            ValorSesion,
            IdEspecialidad // Agregado el campo IdEspecialidad
        } = req.body;

        console.log("Datos del cuerpo de la solicitud:", req.body);

        // Verificar si algún campo obligatorio está vacío
        if (
            Calle === "" ||
            Numero === "" ||
            IdComuna === "" ||
            PrimerNombre === "" ||
            SegundoNombre === "" ||
            ApellidoPaterno === "" ||
            ApellidoMaterno === "" ||
            Telefono === "" ||
            FechaNacimiento === "" ||
            CorreoElectronico === "" ||
            Contrasena === "" ||
            IdTipoUsuario === "" ||
            Rut === "" ||
            ValorSesion === "" // Agregado ValorSesion a la verificación de campos obligatorios
        ) {
            return res
                .status(400)
                .json({ message: "Faltan o hay campos obligatorios vacíos en la solicitud." });
        }

        // Inserción en la tabla Direccion
        const [direccionResult] = await connection.query(
            "INSERT INTO Direccion (Calle, Numero, IdComuna) VALUES (?, ?, ?)",
            [Calle, Numero, IdComuna]
        );
        const idDireccion = direccionResult.insertId; // Obtener el ID de la dirección insertada

        // Inserción en la tabla Persona
        const [personaResult] = await connection.query(
            "INSERT INTO Persona (PrimerNombre, SegundoNombre, ApellidoPaterno, ApellidoMaterno, Telefono, FechaNacimiento, IdDireccion, Rut) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                PrimerNombre,
                SegundoNombre,
                ApellidoPaterno,
                ApellidoMaterno,
                Telefono,
                FechaNacimiento,
                idDireccion,
                Rut,
            ]
        );
        const idPersona = personaResult.insertId; // Obtener el ID de la persona insertada

        // Inserción en la tabla Usuario
        const [usuarioResult] = await connection.query(
            "INSERT INTO Usuario (CorreoElectronico, Contrasena, IdPersona, IdTipoUsuario) VALUES (?, ?, ?, ?)",
            [CorreoElectronico, Contrasena, idPersona, IdTipoUsuario]
        );
        const idUsuario = usuarioResult.insertId; // Obtener el ID del usuario insertado

        // Inserción en la tabla Psicologo
        const [psicologoResult] = await connection.query(
            "INSERT INTO Psicologo (ValorSesion, IdEspecialidad, IdUsuario, Descripcion) VALUES (?, ?, ?, ?)",
            [ValorSesion, IdEspecialidad, idUsuario, 'Psicologo Especialista']
        );

        const idPsicologo = psicologoResult.insertId;

        await connection.query(
            `INSERT INTO Cita (FechaCita, HoraCita, Duracion, Diagnostico, Tratamiento, IdPaciente, IdEstadoCita, IdPago, IdPsicologo)
                SELECT
                    FechaCita,
                    HoraCita,
                    '1 hora' AS Duracion,
                    NULL AS Diagnostico,
                    NULL AS Tratamiento,
                    1 AS IdPaciente,
                    3 AS IdEstadoCita,
                    1 AS IdPago,
                    IdPsicologo AS IdPsicologo
                FROM
                    Psicologo p,
                    (SELECT '2024-07-15' AS FechaCita UNION ALL
                    SELECT '2024-07-16' UNION ALL
                    SELECT '2024-07-17' UNION ALL
                    SELECT '2024-07-18' UNION ALL
                    SELECT '2024-07-19') AS Fechas,
                    (SELECT '08:00:00' AS HoraCita UNION ALL
                    SELECT '09:30:00' UNION ALL
                    SELECT '11:00:00' UNION ALL
                    SELECT '12:30:00' UNION ALL
                    SELECT '14:00:00' UNION ALL
                    SELECT '15:30:00' UNION ALL
                    SELECT '17:00:00' UNION ALL
                    SELECT '18:30:00' UNION ALL
                    SELECT '20:00:00' UNION ALL
                    SELECT '21:30:00') AS Horas
                    WHERE p.IdPsicologo = ?;`, [idPsicologo]);
    
        // Enviar respuesta al cliente con un mensaje de éxito
        res.status(201).json({ message: "Psicologo creado correctamente." });
    } catch (error) {
        // Manejo de errores
        console.error("Error al crear usuario Psicologo:", error);
        res.status(400).json({ message: "Error al procesar la solicitud." }); // Enviar respuesta de error al cliente
    }
};


export const actualizarPsicologo = async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const {
            IdUsuario, 
            IdPersona,
            IdDireccion,
            Calle,
            Numero,
            IdComuna,
            ValorSesion,
            Telefono,
            Descripcion,
            IdEspecialidad,
            PrimerNombre,
            SegundoNombre,
            ApellidoPaterno,
            ApellidoMaterno
        } = req.body;

        console.log("Datos del cuerpo de la solicitud:", req.body);

        // Inicializar array para almacenar los valores a actualizar en la base de datos
        const valoresActualizados = [];
        const valoresDireccion = []
        const valoresPersona = []

        // Actualizar dirección si se proporcionan datos de dirección
        if (Calle && Numero && IdComuna) {
            valoresDireccion.push(`Calle = '${Calle}'`, `Numero = ${Numero}`, `IdComuna = ${IdComuna}`);
        }

        if (PrimerNombre) {
            valoresPersona.push(`PrimerNombre = '${PrimerNombre}'`);
        }

        if (SegundoNombre) {
            valoresPersona.push(`SegundoNombre = '${SegundoNombre}'`);                
        }

        if (ApellidoPaterno) {
            valoresPersona.push(`ApellidoPaterno = '${ApellidoPaterno}'`);               
        }

        if (ApellidoMaterno) {
            valoresPersona.push(`ApellidoMaterno = '${ApellidoMaterno}'`);
        }

        // Actualizar valor de sesión si se proporciona
        if (ValorSesion) {
            valoresActualizados.push(`ValorSesion = ${ValorSesion}`);
        }

        // Actualizar teléfono si se proporciona
        if (Telefono) {
            valoresPersona.push(`Telefono = '${Telefono}'`);
        }

        if (Descripcion) {
            valoresActualizados.push(`Descripcion = '${Descripcion}'`);
        }

        if (IdEspecialidad) {
            valoresActualizados.push(`IdEspecialidad= ${IdEspecialidad}`);
        }


        // Si no hay campos para actualizar, enviar un mensaje de error
        if (valoresActualizados.length === 0) {
            return res.status(400).json({ message: "No se proporcionaron campos válidos para actualizar." });
        }

        // Realizar la actualización en la base de datos
        await connection.query(
            `UPDATE Psicologo SET ${valoresActualizados.join(', ')} WHERE IdUsuario = ?`,
            [IdUsuario]
        );

        await connection.query(
            `UPDATE Persona SET ${valoresPersona.join(', ')} WHERE IdPersona = ?`,
            [IdPersona]
        );

        await connection.query(
            `UPDATE Direccion SET ${valoresDireccion.join(', ')} WHERE IdDireccion = ?`,
            [IdDireccion]
        );

        // Enviar respuesta al cliente con un mensaje de éxito
        res.status(200).json({ message: "Psicologo actualizado correctamente." });
    } catch (error) {
        // Manejo de errores
        console.error("Error al actualizar psicólogo:", error);
        res.status(400).json({ message: "Error al procesar la solicitud de actualización." }); // Enviar respuesta de error al cliente
    }
};

export const citas_psicologo = async (req, res) => {
    const { IdPsicologo } = req.query;
    try {
        const sqlQuery = `
        SELECT
        c.IdCita,
        pc.IdPaciente,
        DATE_FORMAT(c.FechaCita, '%d-%m-%Y') AS FechaCita,
        DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita,
        c.Diagnostico,
        c.Tratamiento,
        c.IdPaciente,
        CONCAT(p.PrimerNombre, ' ', p.SegundoNombre, ' ', p.ApellidoPaterno, ' ', p.ApellidoMaterno) AS Nombre_Paciente,
        ec.DescripcionEstado AS estado_cita
    FROM
        Cita c
    INNER JOIN Paciente pc ON c.IdPaciente = pc.IdPaciente
    INNER JOIN Usuario u ON pc.IdUsuario = u.IdUsuario
    INNER JOIN Persona p ON u.IdPersona = p.IdPersona
    INNER JOIN EstadoCita ec ON c.IdEstadoCita = ec.IdEstadoCita
    WHERE c.IdPsicologo = ? AND c.IdEstadoCita IN (1, 2)
    ORDER BY c.FechaCita DESC, c.HoraCita DESC;
    `;

        // Ejecutar la consulta SQL y obtener el resultado
        const [result] = await connection.query(sqlQuery, [IdPsicologo]);

        // Verificar si se encontraron citas asociadas al psicólogo
        if (result.length === 0) {
            return res.status(404).json({ message: "No se encontraron citas." });
        }

        // Enviar el resultado como respuesta
        res.json(result);
    } catch (error) {
        console.error("Error al obtener el historial de citas:", error.message); // Detalle del error
        res.status(500).json({ message: "Error al obtener el historial de citas: " + error.message }); // Detalle del error
    }
};

//Traer historial de las citas concluidas
export const historial_psicologo = async (req, res) => {
    const { IdPsicologo } = req.query;
    try {
        const sqlQuery = `
        SELECT
        c.IdCita,
        pc.IdPaciente,
        DATE_FORMAT(c.FechaCita, '%d-%m-%Y') AS FechaCita,
        DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita,
        c.Diagnostico,
        c.Tratamiento,
        CONCAT(p.PrimerNombre, ' ', p.SegundoNombre, ' ', p.ApellidoPaterno, ' ', p.ApellidoMaterno) AS Nombre_Paciente,
        ec.DescripcionEstado AS estado_cita,
        pc.IdPaciente
    FROM
        Cita c
    INNER JOIN Paciente pc ON c.IdPaciente = pc.IdPaciente
    INNER JOIN Usuario u ON pc.IdUsuario = u.IdUsuario
    INNER JOIN Persona p ON u.IdPersona = p.IdPersona
    INNER JOIN EstadoCita ec ON c.IdEstadoCita = ec.IdEstadoCita
    WHERE c.IdPsicologo = ? AND c.IdEstadoCita IN (2)
    ORDER BY c.FechaCita DESC, c.HoraCita DESC;
    `;

        // Ejecutar la consulta SQL y obtener el resultado
        const [result] = await connection.query(sqlQuery, [IdPsicologo]);

        // Verificar si se encontraron citas asociadas al psicólogo
        if (result.length === 0) {
            return res.status(404).json({ message: "No se encontraron citas." });
        }

        // Enviar el resultado como respuesta
        res.json(result);
    } catch (error) {
        console.error("Error al obtener el historial de citas:", error.message); // Detalle del error
        res.status(500).json({ message: "Error al obtener el historial de citas: " + error.message }); // Detalle del error
    }
};

//Traer citas asignadas de psicologo
export const atenciones_psicologo = async (req, res) => {
    const { IdPsicologo } = req.query;
    try {
        const sqlQuery = `
        SELECT
        c.IdCita,
        pc.IdPaciente,
        DATE_FORMAT(c.FechaCita, '%d-%m-%Y') AS FechaCita,
        DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita,
        c.Diagnostico,
        c.Tratamiento,
        CONCAT(p.PrimerNombre, ' ', p.SegundoNombre, ' ', p.ApellidoPaterno, ' ', p.ApellidoMaterno) AS Nombre_Paciente,
        ec.DescripcionEstado AS estado_cita
    FROM
        Cita c
    INNER JOIN Paciente pc ON c.IdPaciente = pc.IdPaciente
    INNER JOIN Usuario u ON pc.IdUsuario = u.IdUsuario
    INNER JOIN Persona p ON u.IdPersona = p.IdPersona
    INNER JOIN EstadoCita ec ON c.IdEstadoCita = ec.IdEstadoCita
    WHERE c.IdPsicologo = ? AND c.IdEstadoCita IN (1)
    AND (DATE(c.FechaCita) > DATE(NOW()) OR (DATE(c.FechaCita) = DATE(NOW()) 
    AND TIME(c.HoraCita) >= DATE_SUB(TIME(NOW()), INTERVAL 4 HOUR)))
    ORDER BY c.FechaCita, c.HoraCita;
    `;

        // Ejecutar la consulta SQL y obtener el resultado
        const [result] = await connection.query(sqlQuery, [IdPsicologo]);

        // Verificar si se encontraron citas asociadas al psicólogo
        if (result.length === 0) {
            return res.status(404).json({ message: "No se encontraron citas." });
        }

        // Enviar el resultado como respuesta
        res.json(result);
    } catch (error) {
        console.error("Error al obtener el historial de citas:", error.message); // Detalle del error
        res.status(500).json({ message: "Error al obtener el historial de citas: " + error.message }); // Detalle del error
    }
};

export const traerEspecialidad = async (req, res) => {
    const { NombreEspecialidad } = req.query;
    try {
        const [result] = await connection.query("SELECT * FROM Especialidad WHERE NombreEspecialidad = ?", [NombreEspecialidad]);
        res.json(result);
    } catch (error) {
        console.error("Error al obtener Especilidad:", error);
        res.status(500).json({ message: "Error al obtener Especilidad." });
    }
};

export const especialidades = async (req, res) => {
    try {
        const [result] = await connection.query("SELECT * FROM Especialidad");
        res.json(result);
    } catch (error) {
        console.error("Error al obtener Especilidad:", error);
        res.status(500).json({ message: "Error al obtener Especilidad." });
    }
};

