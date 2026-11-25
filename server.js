import express from 'express';
import cors from 'cors';
import { veritabaniHazirla } from './database.js';

const app = express();
const PORT = process.env.PORT || 3000; // Canlı sunucuda (Render) otomatik port alabilmesi için

app.use(cors());
app.use(express.json());

// Sunucu başlarken veritabanını hazırla
const db = await veritabaniHazirla();

// 1. TÜM CİHAZLARI GETİR (GET)
app.get('/api/cihazlar', async (req, res) => {
  try {
    const cihazlar = await db.all('SELECT * FROM cihazlar');
    res.json(cihazlar);
  } catch (hata) {
    res.status(500).json({ mesaj: 'Veriler alınırken hata oluştu.' });
  }
});

// 2. YENİ CİHAZ EKLE (POST)
app.post('/api/cihazlar', async (req, res) => {
  try {
    const { ad, sicaklik } = req.body;
    if (!ad || sicaklik === undefined) {
      return res.status(400).json({ mesaj: 'Cihaz adı ve sıcaklık zorunludur.' });
    }

    const sonuc = await db.run(
      'INSERT INTO cihazlar (ad, sicaklik) VALUES (?, ?)',
      [ad, Number(sicaklik)]
    );

    res.status(201).json({ id: sonuc.lastID, ad, sicaklik: Number(sicaklik) });
  } catch (hata) {
    res.status(500).json({ mesaj: 'Cihaz eklenemedi.' });
  }
});

// 3. CİHAZ SICAKLIĞINI GÜNCELLE (PUT)
app.put('/api/cihazlar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sicaklik } = req.body;

    const sonuc = await db.run(
      'UPDATE cihazlar SET sicaklik = ? WHERE id = ?',
      [Number(sicaklik), id]
    );

    if (sonuc.changes === 0) {
      return res.status(404).json({ mesaj: 'Cihaz bulunamadı.' });
    }

    res.json({ mesaj: 'Sıcaklık güncellendi.' });
  } catch (hata) {
    res.status(500).json({ mesaj: 'Güncelleme başarısız.' });
  }
});

// 4. CİHAZ SİL (DELETE)
app.delete('/api/cihazlar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sonuc = await db.run('DELETE FROM cihazlar WHERE id = ?', [id]);

    if (sonuc.changes === 0) {
      return res.status(404).json({ mesaj: 'Silinecek cihaz bulunamadı.' });
    }

    res.json({ mesaj: 'Cihaz silindi.' });
  } catch (hata) {
    res.status(500).json({ mesaj: 'Silme işlemi başarısız.' });
  }
});

app.listen(PORT, () => {
  console.log(`Sunucu ve SQLite veritabanı ${PORT} portunda çalışıyor...`);
});