import { config } from "./enviroment.config";
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { DB_CONNECTION_STRING } = config;

// Crear pool de conexiones
const pool = new pg.Pool({
  connectionString: DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Función para ejecutar consultas
export const query = async (text: string, params: any[] = []) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Consulta ejecutada', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error en consulta', { text, error });
    throw error;
  }
};

// Función para inicializar la BD
export const initDatabase = async () => {
  try {
    // Verificar conexión
    await pool.query('SELECT NOW()');
    console.log("Conectado a la base de datos");
    
    // Leer archivo de script SQL
    const sqlFilePath = path.join(process.cwd(), 'src', 'config', 'init-database.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Ejecutar script SQL
    await pool.query(sqlScript);
    console.log("Tablas inicializadas correctamente");
    
    return true;
  } catch (error) {
    console.error("Error de conexión o inicialización de la base de datos:", error);
    return false;
  }
};
