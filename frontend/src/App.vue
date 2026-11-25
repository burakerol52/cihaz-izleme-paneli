<script setup>
import { ref, onMounted } from 'vue';

const cihazlar = ref([]);
const yeniAd = ref('');
const yeniSicaklik = ref('');

// Adresi artık sabit yazmıyoruz; .env dosyasından dinamik okuyoruz
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/cihazlar';

// 1. Cihazları Getir (GET)
const cihazlariGetir = async () => {
  const cevap = await fetch(API_URL);
  cihazlar.value = await cevap.json();
};

// 2. Yeni Cihaz Ekle (POST)
const cihazEkle = async () => {
  if (!yeniAd.value || yeniSicaklik.value === '') return;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ad: yeniAd.value,
      sicaklik: Number(yeniSicaklik.value)
    })
  });

  yeniAd.value = '';
  yeniSicaklik.value = '';
  cihazlariGetir();
};

// 3. Cihaz Sıcaklığını Güncelle (PUT)
const sicaklikGuncelle = async (cihaz) => {
  const yeniDeger = prompt(`${cihaz.ad} için yeni sıcaklık değerini (°C) girin:`, cihaz.sicaklik);
  if (yeniDeger === null || yeniDeger.trim() === '' || isNaN(Number(yeniDeger))) return;

  await fetch(`${API_URL}/${cihaz.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sicaklik: Number(yeniDeger) })
  });

  cihazlariGetir();
};

// 4. Cihaz Sil (DELETE)
const cihazSil = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  cihazlariGetir();
};

onMounted(() => {
  cihazlariGetir();
});
</script>

<template>
  <div class="panel">
    <header class="ust-bilgi">
      <h1>📡 Gömülü Sistem Cihaz İzleme Paneli</h1>
      <p>Gerçek Zamanlı Telemetri ve Durum Kontrolü</p>
    </header>

    <!-- Yeni Cihaz Ekleme Kartı -->
    <div class="form-karti">
      <input v-model="yeniAd" placeholder="Cihaz Adı (örn: STM32-F407)" />
      <input v-model="yeniSicaklik" type="number" step="0.1" placeholder="Sıcaklık (°C)" />
      <button class="ekle-btn" @click="cihazEkle">+ Cihaz Ekle</button>
    </div>

    <!-- Cihaz Kartları Listesi -->
    <div class="cihaz-listesi">
      <div v-for="cihaz in cihazlar" :key="cihaz.id" class="cihaz-karti">
        <div class="cihaz-bilgi">
          <div class="baslik-satiri">
            <strong>{{ cihaz.ad }}</strong>
            <span :class="['durum-rozeti', cihaz.sicaklik >= 50 ? 'kritik' : 'normal']">
              {{ cihaz.sicaklik >= 50 ? '⚠️ Kritik Sıcaklık' : '✅ Normal' }}
            </span>
          </div>
          <span class="sicaklik-degeri">{{ cihaz.sicaklik }} °C</span>
        </div>

        <div class="buton-grubu">
          <button class="guncelle-btn" @click="sicaklikGuncelle(cihaz)">Güncelle</button>
          <button class="sil-btn" @click="cihazSil(cihaz.id)">Sil</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel { max-width: 650px; margin: 40px auto; font-family: 'Segoe UI', sans-serif; color: #2c3e50; padding: 0 15px; }
.ust-bilgi { text-align: center; margin-bottom: 30px; }
.ust-bilgi h1 { margin: 0; font-size: 24px; color: #1a252f; }
.ust-bilgi p { margin: 5px 0 0; color: #7f8c8d; font-size: 14px; }

.form-karti { display: flex; gap: 10px; background: #f8f9fa; padding: 15px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.06); margin-bottom: 25px; }
input { padding: 10px; flex: 1; border: 1px solid #dcdde1; border-radius: 6px; font-size: 14px; }
.ekle-btn { padding: 10px 18px; background: #2ecc71; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
.ekle-btn:hover { background: #27ae60; }

.cihaz-listesi { display: flex; flex-direction: column; gap: 12px; }
.cihaz-karti { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: white; border: 1px solid #ecf0f1; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.04); }
.baslik-satiri { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.sicaklik-degeri { font-size: 20px; font-weight: bold; color: #34495e; }

.durum-rozeti { font-size: 12px; padding: 3px 8px; border-radius: 12px; font-weight: 600; }
.durum-rozeti.normal { background: #e8f8f5; color: #1abc9c; }
.durum-rozeti.kritik { background: #fdedec; color: #e74c3c; }

.buton-grubu { display: flex; gap: 8px; }
.guncelle-btn { background: #3498db; color: white; border: none; padding: 7px 12px; border-radius: 6px; cursor: pointer; }
.sil-btn { background: #e74c3c; color: white; border: none; padding: 7px 12px; border-radius: 6px; cursor: pointer; }
</style>