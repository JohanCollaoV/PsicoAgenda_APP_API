import { createPool } from "mysql2/promise";

export const connection = createPool({
    host: "psicoagenda-db.c9o402262e74.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "12345678",
    database: "psicoagenda",
    port: 3306,
});

// Configuración de la conexión a la base de datos
/*const connection = mysql.createConnection({
    host: 'sql10.freemysqlhosting.net',
    user: 'sql10701787',
    password: 'Q8QAk2wWi3',
    database: 'sql10701787', 
    port: 3306
  });
  
  // Conectar a la base de datos
  connection.connect((err) => {
    if (err) {
      console.error('Error de conexión a la base de datos:', err);
      return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
  });
*/
