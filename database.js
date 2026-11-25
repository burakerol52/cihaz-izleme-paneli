import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Veritabanı bağlantısını açan ve tabloyu kuran fonksiyon
export const veritabaniHazirla = async () => {
  // 'cihazlar.db' adında gerçek bir veritabanı dosyası oluşturur (varsa açar)
  const db = await open({
    filename: './cihazlar.db',
    driver: sqlite3.Database
  });

  // SQL komutu: Eğer 'cihazlar' tablosu yoksa sıfırdan oluştur
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cihazlar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ad TEXT NOT NULL,
      sicaklik REAL NOT NULL
    )
  `);

  // Tablo tamamen boşsa başlangıç için 2 örnek cihaz ekleyelim
  const kayitSayisi = await db.get('SELECT COUNT(*) as sayi FROM cihazlar');
  if (kayitSayisi.sayi === 0) {
    await db.run('INSERT INTO cihazlar (ad, sicaklik) VALUES (?, ?)', ['STM32-Node-01', 42.5]);
    await db.run('INSERT INTO cihazlar (ad, sicaklik) VALUES (?, ?)', ['ESP32-Sensor-02', 36.8]);
  }

  return db;
};