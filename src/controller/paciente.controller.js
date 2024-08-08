import { connection } from "../../db/db.js";

export const get_pacientes = async (req, res) => {
    try {
        const [result] = await connection.query("SELECT * FROM Usuario WHERE IdTipoUsuario = 1");
        res.json(result);
    } catch (error) {
        console.error("Error al obtener Paciente:", error);
        res.status(500).json({ message: "Error al obtener Pacientes." });
    }
};

export const insertarPaciente = async (req, res) => {
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
            Rut
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
        const [usuarioResult] = await connection.query(
            "INSERT INTO Usuario (CorreoElectronico, Contrasena, IdPersona, IdTipoUsuario) VALUES (?, ?, ?, ?)",
            [CorreoElectronico, Contrasena, idPersona, IdTipoUsuario]
        );
        const idUsuario = usuarioResult.insertId; // Obtener el ID del usuario insertado

        // Inserción en la tabla Psicologo
        await connection.query(
            "INSERT INTO Paciente (IdUsuario) VALUES (?)",
            [idUsuario]
        );

        // Enviar respuesta al cliente con un mensaje de éxito
        res.status(201).json({ message: "Paciente Creado Correctamente." });
    } catch (error) {
        // Manejo de errores
        console.error("Error al crear Paciente:", error);
        res.status(400).json({ message: "Error al procesar la solicitud." }); // Enviar respuesta de error al cliente
    }
};


export const actualizarPaciente = async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const {
            IdPersona,
            IdDireccion,
            Calle,
            Numero,
            IdComuna,
            Telefono,
            PrimerNombre,
            SegundoNombre,
            ApellidoPaterno,
            ApellidoMaterno
        } = req.body;

        console.log("Datos del cuerpo de la solicitud:", req.body);


        // Inicializar array para almacenar los valores a actualizar en la base de datos
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

        // Actualizar teléfono si se proporciona
        if (Telefono) {
            valoresPersona.push(`Telefono = '${Telefono}'`);
        }

        // Realizar la actualización en la base de datos
        await connection.query(
            `UPDATE Persona SET ${valoresPersona.join(', ')} WHERE IdPersona = ?`,
            [IdPersona]
        );

        await connection.query(
            `UPDATE Direccion SET ${valoresDireccion.join(', ')} WHERE IdDireccion = ?`,
            [IdDireccion]
        );

        // Enviar respuesta al cliente con un mensaje de éxito
        res.status(200).json({ message: "Paciente actualizado correctamente." });
    } catch (error) {
        // Manejo de errores
        console.error("Error al actualizar paciente:", error);
        res.status(400).json({ message: "Error al procesar la solicitud de actualización." }); // Enviar respuesta de error al cliente
    }
};

export const updateCita = async (req, res) => { 
    const { IdPaciente, IdEstadoCita, IdCita } = req.query;

    if (!IdPaciente || !IdCita) {
        return res
            .status(400)
            .json({
                message: "Falta información para agendar la cita",
            });
    } else {

        try {
            await connection.query(
                "UPDATE Cita SET Cita.IdPaciente = ?, Cita.IdEstadoCita =  ? WHERE IdCita = ?",
                [IdPaciente, IdEstadoCita, IdCita]
            );
            res.json({ message: "Cita Agendada Correctamente" });
        } catch (error) {
            // Manejo de errores
            console.error("Error al actualizar cita:", error);
            res.status(400).json({ message: "Error al procesar la solicitud de actualización." });
        } 

    }
}

export const finalizarCita = async (req, res) => { 
    const { Tratamiento, Diagnostico, IdCita } = req.query;

    if (!IdCita) {
        return res
            .status(400)
            .json({
                message: "Falta información para agendar la cita",
            });
    } else {

        try {
            await connection.query(
                "UPDATE Cita SET Cita.Tratamiento = ?, Cita.Diagnostico = ? WHERE IdCita = ?",
                [Tratamiento, Diagnostico, IdCita]
            );
            res.json({ message: "Cita Actualizada Correctamente" });
        } catch (error) {
            // Manejo de errores
            console.error("Error al actualizar cita:", error);
            res.status(400).json({ message: "Error al procesar la solicitud de actualización." });
        } 

    }
}

export const insertarCitas = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ message: "Falta información para agendar las citas" });
    }

    const fechas = [];
    let currentDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    while (currentDate <= endDate) {
        fechas.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const horas = [
        '08:00:00', '09:30:00', '11:00:00', '12:30:00',
        '14:00:00', '15:30:00', '17:00:00', '18:30:00',
        '20:00:00', '21:30:00'
    ];

    const valoresInsert = [];
    const queryInsert = `
        INSERT INTO Cita (FechaCita, HoraCita, Duracion, Diagnostico, Tratamiento, IdPaciente, IdEstadoCita, IdPago, IdPsicologo)
        SELECT ?, ?, '1 hora', NULL, NULL, 1, 3, 1, p.IdPsicologo
        FROM Psicologo p;
    `;

    for (const fecha of fechas) {
        for (const hora of horas) {
            valoresInsert.push([fecha, hora]);
        }
    }

    try {
        for (const valores of valoresInsert) {
            await connection.query(queryInsert, valores);
        }
        res.json({ message: "Citas insertadas correctamente" });
    } catch (error) {
        console.error("Error al insertar citas:", error);
        res.status(400).json({ message: "Error al procesar la solicitud de inserción de citas." });
    }
};

export const borrarCita = async (req, res) => {
    const { IdCita } = req.query;
    try {
        const [result] = await connection.query
            ("DELETE FROM Cita WHERE IdCita = ?", [IdCita]);
        res.json({ message: "Cita eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar cita: ", error);
        res.status(500).json({ message: "Error al eliminar cita." });
    }
};