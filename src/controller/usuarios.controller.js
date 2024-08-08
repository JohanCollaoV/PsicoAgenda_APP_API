import { connection } from "../../db/db.js";


export const traerUsuarios = async (req, res) => {
    try {
        const [result] = await connection.query("SELECT * FROM Usuario");
        res.json(result);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error al obtener usuarios." });
    }
};


export const loginUsuario = async (req, res) => {
    const { CorreoElectronico, Contrasena } = req.query;

    if (!CorreoElectronico || !Contrasena) {
        return res
            .status(400)
            .json({
                message: "CorreoElectronico y Contrasena son parámetros obligatorios.",
            });
    }

    try {
        const [result] = await connection.query(
            "SELECT * FROM Usuario WHERE CorreoElectronico = ?",
            [CorreoElectronico]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Credenciales Invalidas." });
        }

        res.json(result);
    } catch (error) {
        console.error("Error al buscar usuario:", error);
        res.status(500).json({ message: "Error al buscar usuario." });
    }
};

export const obtenerIdUsuario = async (req, res) => {
    const { IdTipoUsuario, IdUsuario } = req.query;
    try {
        if (IdTipoUsuario == 1) {
            const [result] = await connection.query("SELECT * FROM Paciente p WHERE IdUsuario = ?;", [IdUsuario]);
            res.json(result);
        } else if (IdTipoUsuario == 2) {
            const [result] = await connection.query("SELECT * FROM Psicologo p WHERE IdUsuario = ?;", [IdUsuario]);
            res.json(result);
        }

    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error al obtener usuarios." });
    }
};

export const datosPersona = async (req, res) => {
    const { IdPersona } = req.query;
    try {

        const [result] = await connection.query("SELECT * FROM Persona WHERE IdPersona = ?;", [IdPersona]);
        res.json(result);

    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error al obtener usuarios." });
    }
};


export const insertarUsuario = async (req, res) => {
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
            Rut === ""
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
        await connection.query(
            "INSERT INTO Usuario (CorreoElectronico, Contrasena, IdPersona, IdTipoUsuario ) VALUES (?, ?, ?, ? )",
            [CorreoElectronico, Contrasena, idPersona, IdTipoUsuario]
        );




        // Enviar respuesta al cliente con un mensaje de éxito
        res.status(201).json({ message: "Usuario creado correctamente." });
    } catch (error) {
        // Manejo de errores
        console.error("Error al crear usuario:", error);
        res.status(400).json({ message: "Error al procesar la solicitud." }); // Enviar respuesta de error al cliente
    }
};


export const cambiarContrasena = async (req, res) => {
    const { CorreoElectronico, NuevaContrasena } = req.query;

    if (!CorreoElectronico || !NuevaContrasena) {
        return res.status(400).json({
            message: "CorreoElectronico y NuevaContrasena son parámetros obligatorios.",
        });
    }

    try {
        const [result] = await connection.query(
            "SELECT * FROM Usuario WHERE CorreoElectronico = ?",
            [CorreoElectronico]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Actualizar la contraseña del usuario
        await connection.query(
            "UPDATE Usuario SET Contrasena = ? WHERE CorreoElectronico = ?",
            [NuevaContrasena, CorreoElectronico]
        );

        res.json({ message: "Contraseña cambiada exitosamente." });
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        res.status(500).json({ message: "Error al cambiar la contraseña." });
    }
};


export const eliminarUsuario = (req, res) => res.send("Borrando usuarios");

// No se esta usando

export const getDetallesCitas = async (req, res) => {
    try {
        const sqlQuery = `
        SELECT  
                c.IdCita,
                up.IdUsuario,
                DATE_FORMAT(c.FechaCita, '%d-%m-%Y') AS fecha,
                DATE_FORMAT(c.HoraCita, '%H:%i') AS hora,
                CONCAT(pp.PrimerNombre, ' ', pp.SegundoNombre, ' ', pp.ApellidoPaterno, ' ', pp.ApellidoMaterno) AS nombre_paciente,
                pp.Rut AS rut_paciente,
                c.Diagnostico,
                c.Tratamiento,
                CONCAT(pp2.PrimerNombre, ' ', pp2.SegundoNombre, ' ', pp2.ApellidoPaterno, ' ', pp2.ApellidoMaterno) AS nombre_psicologo,
                ec.DescripcionEstado AS estado_cita
            FROM
                Cita c
            INNER JOIN Paciente pc ON c.IdPaciente = pc.IdPaciente
            INNER JOIN Usuario up ON pc.IdUsuario = up.IdUsuario
            INNER JOIN Persona pp ON up.IdPersona = pp.IdPersona
            INNER JOIN Psicologo p ON c.IdPsicologo = p.IdPsicologo
            INNER JOIN Usuario up2 ON p.IdUsuario = up2.IdUsuario
            INNER JOIN Persona pp2 ON up2.IdPersona = pp2.IdPersona
            INNER JOIN EstadoCita ec ON c.IdEstadoCita = ec.IdEstadoCita
            
        `;

        const [result] = await connection.query(sqlQuery);
        res.json(result);
    } catch (error) {
        console.error("Error al obtener detalles de citas:", error);
        res.status(500).json({ message: "Error al obtener detalles de citas." });
    }
};

// Historial Citas Pacientes

export const getDetallesCitasById = async (req, res) => {
    try {
        const { IdPaciente } = req.query;

        // Consulta SQL para obtener las citas asociadas al usuario
        const sqlQuery = `
        SELECT
        c.IdCita,
        up.IdUsuario,
        DATE_FORMAT(c.FechaCita, '%d-%m-%Y') AS fecha,
        DATE_FORMAT(c.HoraCita, '%H:%i') AS hora,
        CONCAT(pp.PrimerNombre, ' ', pp.SegundoNombre, ' ', pp.ApellidoPaterno, ' ', pp.ApellidoMaterno) AS nombre_paciente,
        pp.Rut AS rut_paciente,
        DATE_FORMAT(pp.FechaNacimiento, '%d-%m-%Y') AS FechaNacimiento,
        FLOOR(DATEDIFF(CURRENT_DATE, pp.FechaNacimiento) / 365) AS Edad,
        c.Diagnostico,
        c.Tratamiento,
        CONCAT(pp2.PrimerNombre, ' ', pp2.SegundoNombre, ' ', pp2.ApellidoPaterno, ' ', pp2.ApellidoMaterno) AS nombre_psicologo,
        ec.DescripcionEstado AS estado_cita
    FROM
        Cita c
    INNER JOIN Paciente pc ON c.IdPaciente = pc.IdPaciente
    INNER JOIN Usuario up ON pc.IdUsuario = up.IdUsuario
    INNER JOIN Persona pp ON up.IdPersona = pp.IdPersona
    INNER JOIN Psicologo p ON c.IdPsicologo = p.IdPsicologo
    INNER JOIN Usuario up2 ON p.IdUsuario = up2.IdUsuario
    INNER JOIN Persona pp2 ON up2.IdPersona = pp2.IdPersona
    INNER JOIN EstadoCita ec ON c.IdEstadoCita = ec.IdEstadoCita
    WHERE pc.IdPaciente = ? AND ec.IdEstadoCita = 2
    ORDER BY c.FechaCita DESC, c.HoraCita DESC;
        `;

        // Ejecutar la consulta SQL y obtener el resultado
        const [result] = await connection.query(sqlQuery, [IdPaciente]);

        // Verificar si se encontraron citas asociadas al usuario
        if (result.length === 0) {
            return res.status(404).json({ message: "No se encontraron citas para este usuario." });
        }

        // Enviar el resultado como respuesta
        res.json(result);
    } catch (error) {
        console.error("Error al obtener detalles de citas:", error);
        res.status(500).json({ message: "Error al obtener detalles de citas." });
    }
};

export const citasAsignadas = async (req, res) => {
    try {
        const { IdPaciente } = req.query;

        // Consulta SQL para obtener las citas asociadas al usuario
        const sqlQuery = `
        SELECT
        c.IdCita,
        up.IdUsuario,
        DATE_FORMAT(c.FechaCita, '%d-%m-%Y') AS fecha,
        DATE_FORMAT(c.HoraCita, '%H:%i') AS hora,
        CONCAT(pp.PrimerNombre, ' ', pp.SegundoNombre, ' ', pp.ApellidoPaterno, ' ', pp.ApellidoMaterno) AS nombre_paciente,
        pp.Rut AS rut_paciente,
        DATE_FORMAT(pp.FechaNacimiento, '%d-%m-%Y') AS FechaNacimiento,
        FLOOR(DATEDIFF(CURRENT_DATE, pp.FechaNacimiento) / 365) AS Edad,
        c.Diagnostico,
        c.Tratamiento,
        CONCAT(pp2.PrimerNombre, ' ', pp2.SegundoNombre, ' ', pp2.ApellidoPaterno, ' ', pp2.ApellidoMaterno) AS nombre_psicologo,
        ec.DescripcionEstado AS estado_cita
    FROM
        Cita c
    INNER JOIN Paciente pc ON c.IdPaciente = pc.IdPaciente
    INNER JOIN Usuario up ON pc.IdUsuario = up.IdUsuario
    INNER JOIN Persona pp ON up.IdPersona = pp.IdPersona
    INNER JOIN Psicologo p ON c.IdPsicologo = p.IdPsicologo
    INNER JOIN Usuario up2 ON p.IdUsuario = up2.IdUsuario
    INNER JOIN Persona pp2 ON up2.IdPersona = pp2.IdPersona
    INNER JOIN EstadoCita ec ON c.IdEstadoCita = ec.IdEstadoCita
    WHERE pc.IdPaciente = ? AND ec.IdEstadoCita = 1;
    
        `;

        // Ejecutar la consulta SQL y obtener el resultado
        const [result] = await connection.query(sqlQuery, [IdPaciente]);

        // Verificar si se encontraron citas asociadas al usuario
        if (result.length === 0) {
            return res.status(404).json({ message: "No se encontraron citas para este usuario." });
        }

        // Enviar el resultado como respuesta
        res.json(result);
    } catch (error) {
        console.error("Error al obtener detalles de citas:", error);
        res.status(500).json({ message: "Error al obtener detalles de citas." });
    }
};

//Próxima Cita Paciente por IdPaciente

export const getProximaCitaById = async (req, res) => {
    try {
        const { IdPaciente } = req.query;

        const sqlQuery = `
        SELECT
            c.IdCita,
            up.IdUsuario,
            DATE_FORMAT(c.FechaCita, '%d-%m-%Y') AS fecha,
            DATE_FORMAT(c.HoraCita, '%H:%i') AS hora,
            CONCAT(pp.PrimerNombre, ' ', pp.SegundoNombre, ' ', pp.ApellidoPaterno, ' ', pp.ApellidoMaterno) AS nombre_paciente,
            pp.Rut AS rut_paciente,
            c.Diagnostico,
            c.Tratamiento,
            CONCAT(pp2.PrimerNombre, ' ', pp2.SegundoNombre, ' ', pp2.ApellidoPaterno, ' ', pp2.ApellidoMaterno) AS nombre_psicologo,
            ec.DescripcionEstado AS estado_cita
        FROM
            Cita c
        INNER JOIN Paciente pc ON c.IdPaciente = pc.IdPaciente
        INNER JOIN Usuario up ON pc.IdUsuario = up.IdUsuario
        INNER JOIN Persona pp ON up.IdPersona = pp.IdPersona
        INNER JOIN Psicologo p ON c.IdPsicologo = p.IdPsicologo
        INNER JOIN Usuario up2 ON p.IdUsuario = up2.IdUsuario
        INNER JOIN Persona pp2 ON up2.IdPersona = pp2.IdPersona
        INNER JOIN EstadoCita ec ON c.IdEstadoCita = ec.IdEstadoCita
        WHERE pc.IdPaciente = ? AND ec.DescripcionEstado = 'Asignado'
        AND (DATE(c.FechaCita) > DATE(NOW()) OR (DATE(c.FechaCita) = DATE(NOW()) 
        AND TIME(c.HoraCita) >= DATE_SUB(TIME(NOW()), INTERVAL 4 HOUR)))
        ORDER BY c.FechaCita, c.HoraCita
        LIMIT 1;
        `;

        const [result] = await connection.query(sqlQuery, [IdPaciente]);

        if (result.length === 0) {
            return res.status(404).json({ message: "No se encontraron próximas citas asignadas para este usuario." });
        }

        res.json(result[0]);
    } catch (error) {
        console.error("Error al obtener la próxima cita asignada:", error);
        res.status(500).json({ message: "Error al obtener la próxima cita asignada." });
    }
};

export const saveToken = async (req, res) => {
    const { Token, CorreoElectronico } = req.query;

    if (!Token || !CorreoElectronico) {
        return res
            .status(400)
            .json({
                message: "Falta información para guardar el token",
            });
    } else {

        try {
            await connection.query(
                "UPDATE Usuario SET Usuario.Token = ? WHERE CorreoElectronico = ?",
                [Token, CorreoElectronico]
            );
            res.json({ message: "Token Guardado" });
        } catch (error) {
            // Manejo de errores
            console.error("Error al actualizar token:", error);
            res.status(400).json({ message: "Error al procesar la solicitud de actualización." });
        }

    }
};

export const mantendorBuscar = async (req, res) => {
    const { Criterio, Dato } = req.query;
    try {
        if (Criterio == 1) {
            const [result] = await connection.query(
                `SELECT 
                    c.IdCita,
                    pc.IdPaciente,
                    DATE_FORMAT(c.FechaCita, '%d-%m-%Y') AS FechaCita,
                    DATE_FORMAT(c.HoraCita, '%H:%i') as HoraCita,
                    CONCAT(pp.PrimerNombre, ' ', pp.ApellidoPaterno) AS NombrePaciente,
                    CONCAT(pp2.PrimerNombre, ' ', pp2.ApellidoPaterno) AS NombrePsicologo,
                    ec.DescripcionEstado
                    FROM Cita c
                    INNER JOIN Paciente pc ON c.IdPaciente = pc.IdPaciente
                    INNER JOIN Usuario up ON pc.IdUsuario = up.IdUsuario
                    INNER JOIN Persona pp ON up.IdPersona = pp.IdPersona
                    INNER JOIN Psicologo p ON c.IdPsicologo = p.IdPsicologo
                    INNER JOIN Usuario up2 ON p.IdUsuario = up2.IdUsuario
                    INNER JOIN Persona pp2 ON up2.IdPersona = pp2.IdPersona
                    INNER JOIN EstadoCita ec ON c.IdEstadoCita = ec.IdEstadoCita
                    WHERE c.IdCita = ?`, [Dato]);
            res.json(result);
        } else if (Criterio == 2) {
            const [result] = await connection.query(
                `SELECT 
                    c.IdCita,
                    pc.IdPaciente,
                    DATE_FORMAT(c.FechaCita, '%d-%m-%Y') AS FechaCita,
                    DATE_FORMAT(c.HoraCita, '%H:%i') as HoraCita,
                    CONCAT(pp.PrimerNombre, ' ', pp.ApellidoPaterno) AS NombrePaciente,
                    CONCAT(pp2.PrimerNombre, ' ', pp2.ApellidoPaterno) AS NombrePsicologo,
                    ec.DescripcionEstado
                    FROM Cita c
                    INNER JOIN Paciente pc ON c.IdPaciente = pc.IdPaciente
                    INNER JOIN Usuario up ON pc.IdUsuario = up.IdUsuario
                    INNER JOIN Persona pp ON up.IdPersona = pp.IdPersona
                    INNER JOIN Psicologo p ON c.IdPsicologo = p.IdPsicologo
                    INNER JOIN Usuario up2 ON p.IdUsuario = up2.IdUsuario
                    INNER JOIN Persona pp2 ON up2.IdPersona = pp2.IdPersona
                    INNER JOIN EstadoCita ec ON c.IdEstadoCita = ec.IdEstadoCita
                    WHERE pp.Rut = ? OR pp2.Rut = ?`, [Dato, Dato]);
            res.json(result);
        }

    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error al obtener usuarios." });
    }
};

export const mantendorUsuario = async (req, res) => {
    const { Criterio, Dato } = req.query;
    try {
        if (Criterio == 1) {
            const [result] = await connection.query(
                `SELECT 
                    u.IdUsuario,
                    u.IdTipoUsuario,
                    p.IdPersona,
                    d.IdDireccion,
                    p.PrimerNombre,
                    p.SegundoNombre,
                    p.ApellidoPaterno,
                    p.ApellidoMaterno,
                    p.Telefono,
                    d.Calle,
                    d.Numero,
                    c.NombreComuna,
                    ps.ValorSesion,
                    ps.Descripcion,
                    e.NombreEspecialidad
                    FROM Persona p
                    INNER JOIN Usuario u ON u.IdPersona = p.IdPersona
                    INNER JOIN Direccion d ON p.IdDireccion = d.IdDireccion
                    INNER JOIN Comuna c ON c.IdComuna = d.IdComuna
                    LEFT JOIN Psicologo ps ON u.IdUsuario = ps.IdUsuario
                    LEFT JOIN Especialidad e ON e.IdEspecialidad = ps.IdEspecialidad
                    WHERE u.IdUsuario = ?`, [Dato]);
            res.json(result);
        } else if (Criterio == 2) {
            const [result] = await connection.query(
                `SELECT 
                    u.IdUsuario,
                    u.IdTipoUsuario,
                    p.IdPersona,
                    d.IdDireccion,
                    p.PrimerNombre,
                    p.SegundoNombre,
                    p.ApellidoPaterno,
                    p.ApellidoMaterno,
                    p.Telefono,
                    d.Calle,
                    d.Numero,
                    c.NombreComuna,
                    ps.ValorSesion,
                    ps.Descripcion,
                    e.NombreEspecialidad
                    FROM Persona p
                    INNER JOIN Usuario u ON u.IdPersona = p.IdPersona
                    INNER JOIN Direccion d ON p.IdDireccion = d.IdDireccion
                    INNER JOIN Comuna c ON c.IdComuna = d.IdComuna
                    LEFT JOIN Psicologo ps ON u.IdUsuario = ps.IdUsuario
                    LEFT JOIN Especialidad e ON e.IdEspecialidad = ps.IdEspecialidad
                    WHERE p.Rut = ?`, [Dato]);
            res.json(result);
        }

    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error al obtener usuarios." });
    }
};

export const traerComunas = async (req, res) => {
    const { NombreComuna } = req.query;
    try {
        const [result] = await connection.query("SELECT * FROM Comuna WHERE NombreComuna = ?", [NombreComuna]);
        res.json(result);
    } catch (error) {
        console.error("Error al obtener comuna:", error);
        res.status(500).json({ message: "Error al obtener comuna." });
    }
};

export const comunas = async (req, res) => {
    try {
        const [result] = await connection.query("SELECT * FROM Comuna");
        res.json(result);
    } catch (error) {
        console.error("Error al obtener comuna:", error);
        res.status(500).json({ message: "Error al obtener comuna." });
    }
};


export const idChat = async (req, res) => {
    const { Criterio, Dato } = req.query;
    try {
        if (Criterio == 1) {
            const [result] = await connection.query(
                `SELECT 
                    c.IdPaciente,
                    u.IdUsuario,
                    CONCAT(p.PrimerNombre, ' ', p.SegundoNombre, ' ', p.ApellidoPaterno, ' ', p.ApellidoMaterno) AS Nombre
                    FROM Cita c 
                    INNER JOIN Paciente pa ON c.IdPaciente = pa.IdPaciente 
                    INNER JOIN Usuario u ON pa.IdUsuario = u.IdUsuario 
                    INNER JOIN Persona p ON p.IdPersona = u.IdPersona
                    WHERE IdEstadoCita IN (1, 2)
                    AND IdPsicologo = ?
                    GROUP BY IdPaciente
                    ORDER BY IdPaciente`, [Dato]);
            res.json(result);
        } else if (Criterio == 2) {
            const [result] = await connection.query(
                `SELECT
                    c.IdPsicologo,
                    u.IdUsuario,
                    CONCAT(p.PrimerNombre, ' ', p.SegundoNombre, ' ', p.ApellidoPaterno, ' ', p.ApellidoMaterno) AS Nombre
                    FROM Cita c 
                    INNER JOIN Psicologo ps ON c.IdPsicologo = ps.IdPsicologo 
                    INNER JOIN Usuario u ON ps.IdUsuario = u.IdUsuario 
                    INNER JOIN Persona p ON p.IdPersona = u.IdPersona
                    WHERE IdEstadoCita IN (1, 2)
                    AND IdPaciente = ?
                    GROUP BY IdPsicologo
                    ORDER BY IdPsicologo `, [Dato]);
            res.json(result);
        }

    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).json({ message: "Error al obtener datos." });
    }
};



