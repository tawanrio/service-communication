import multer from 'multer';
import sharp from 'sharp';
import heicConvert from 'heic-convert';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import path, { dirname } from 'path';
import { formatStrToNoSpecialChars, truncateFileName } from '../utils/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para criar diretórios se não existirem
const ensureDirExists = async (dir) => {
  try {
    await fs.access(dir);
  } catch (error) {
    await fs.mkdir(dir, { recursive: true });
  }
};

// Configurar armazenamento do multer
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');

// Middleware para processamento de arquivos
const handleFileUpload = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error uploading file' });
    }

    try {
      const { buffer, originalname } = req.file;
      const processedFilePath = await processAndSaveFile(buffer, originalname);
    //   fileData.path = fileData.path.replaceAll('\\', '/');
      req.processedFilePath = processedFilePath.replaceAll('\\', '/'); // Adiciona o caminho do arquivo processado ao objeto da requisição
      next(); // Chama o próximo middleware ou rota
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Função para converter HEIC para JPG
const convertHeicToJpg = async (buffer) => {
  const outputBuffer = await heicConvert({
    buffer,
    format: 'JPEG',
    quality: 1,
  });
  return outputBuffer;
};

// Função para processar e salvar arquivo
const processAndSaveFile = async (buffer, originalName) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', year.toString(), month);

  await ensureDirExists(uploadDir);

  const isHeic = originalName.toLowerCase().endsWith('.heic');
  let fileBuffer = buffer;

  if (isHeic) {
    fileBuffer = await convertHeicToJpg(buffer);
    originalName = originalName.replace(/\.heic$/i, '.jpg');
  }

  originalName = formatStrToNoSpecialChars(originalName);
  originalName = truncateFileName(originalName);

  const filePath = path.join(uploadDir, `${Date.now()}-${originalName}`);

  if (originalName.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
    const image = sharp(fileBuffer);
    const metadata = await image.metadata();

    if (metadata.size > 500 * 1024 || metadata.width > 1200 || metadata.height > 1200) {
      await image
        .resize({
          width: metadata.width > 1200 ? 1200 : null,
          height: metadata.height > 1200 ? 1200 : null,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toFile(filePath);
    } else {
      await fs.writeFile(filePath, fileBuffer);
    }
  } else {
    await fs.writeFile(filePath, fileBuffer);
  }

  return path.join('/uploads', year.toString(), month, path.basename(filePath));
};

export { handleFileUpload };
