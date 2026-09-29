import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable static assets serving with index fallback
app.use(express.static(__dirname, {
  dotfiles: 'ignore',
  etag: true,
  extensions: ['html', 'htm', 'css', 'js', 'jpg', 'jpeg', 'png', 'webp', 'svg', 'json'],
  index: ['index.html'],
  maxAge: '1d'
}));

// Fallback to index.html for root / unknown paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Lifestyle Carousel server running on http://0.0.0.0:${PORT}`);
});
