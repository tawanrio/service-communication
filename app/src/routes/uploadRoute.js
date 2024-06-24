import { Router } from 'express';
import { handleFileUpload } from '../services/uploadService.js';

export const uploadRoute = Router();

uploadRoute.post('/', handleFileUpload, (req, res) => {
    // Envia a resposta ao cliente com o caminho do arquivo processado

    console.log(req.processedFilePath);
    
    res.status(200).json({ status: 200, message: 'File uploaded successfully', path: req.processedFilePath });
  });