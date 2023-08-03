const { MongoClient } = require('mongodb');
const config = require('./config'); // Asegúrate de tener una configuración válida

const uri = config.dbUrl; // Obtiene la URL de conexión desde tu archivo de configuración
const client = new MongoClient(uri);

async function connectAndQuery() {
  try {
    await client.connect();
    console.log('Conexión a la base de datos establecida');

    const db = client.db(); // Obtiene una referencia a la base de datos

    // Realiza una consulta (por ejemplo, obtener todos los usuarios)
    const usersCollection = db.collection('users');
    const users = await usersCollection.find().toArray();

    console.log('Usuarios encontrados:');
    console.log(users);

    // Cierra la conexión después de completar las operaciones
    await client.close();
    console.log('Conexión cerrada');
  } catch (error) {
    console.error('Error al conectar a la base de datos o al realizar la consulta:', error);
  }
}

// Llamada a la función para conectar y consultar datos
connectAndQuery();
