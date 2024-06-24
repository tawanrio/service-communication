import { uploadRoute } from './src/routes/uploadRoute.js';
import express from 'express';
import { fileURLToPath } from 'url';
import path, {dirname} from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const server = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.NODE_LOCAL_PORT || 3000;
const domain = process.env.DOMAIN ||  'http://localhost';


// const mongoose = restful.mongoose

// // Database
// mongoose.Promise = global.Promise
// mongoose.connect('mongodb://db/mydb')

server.use(cors())

server.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

server.use('/communication/files/upload', uploadRoute);

// Route test
server.get('/', (req, res, next) => res.send({status:'API running!!'}))

// server.all('*', (req, res) => {
//     res.status(404).send('Not Found');
//   });
  

// Start Server
server.listen(port, () => {
    console.log(`Server is running on ${domain}:${port}`);
  });
  