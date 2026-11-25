export const sicaklikDurumu = (derece) => {
  if (derece > 75) {
    return "UYARI: Cihaz asiri isindi!";
  }
  return "Normal sicaklik.";
};

export const bataryaYuzdesi = (mevcutVoltaj, maxVoltaj) => {
  return Math.round((mevcutVoltaj / maxVoltaj) * 100);
};