// ==========================================
// BABYCARE BAND - DUAL-CORE AUDIO GATEWAY
// Board: DOIT ESP32 DEVKIT V1
// ==========================================

#include <WiFi.h>
#include <WiFiUdp.h>
#include <esp_now.h>

const char* ssid     = "Mi11Lite";      
const char* password = "Zifani2475";
const char* laptopIP = "10.125.26.172"; // ⚠️ Ganti dengan IP Laptopmu jika berubah
const int laptopPort = 5001;                  
const int boxPort    = 5000;

uint8_t gelangAddress[] = {0xA0, 0xF2, 0x62, 0xA5, 0x43, 0xEC};
const int micPin = 32; 

WiFiUDP udp;

typedef struct struct_message { int polaGetar; } struct_message;
struct_message dataKirim;
unsigned long waktuKirimTerakhir = 0;
const int jedaKirim = 3000; 

// ==========================================
// SISTEM ANTREAN (QUEUE) UNTUK MULTITHREADING
// ==========================================
QueueHandle_t antreanAudio;

// ---------------------------------------------------------
// [DIAGNOSTIK 1]: CEK STATUS KONEKSI ESP-NOW KE GELANG
// ---------------------------------------------------------
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("[ESP-NOW] Tembakan ke Gelang C3 -> ");
  if (status == ESP_NOW_SEND_SUCCESS) {
    Serial.println("✅ SUKSES DITERIMA (Gelang Aktif!)");
  } else {
    Serial.println("❌ GAGAL (Gelang mati / di luar jangkauan / MAC salah)");
  }
}

// ==========================================
// TUGAS CORE 0: KHUSUS WIFI & ESP-NOW
// ==========================================
void TaskJaringan(void *pvParameters) {
  int16_t bufferKirim[512];
  
  for(;;) {
    // 1. Ambil data dari antrean (tunggu maks 100ms), lalu kirim via UDP
    if(xQueueReceive(antreanAudio, &bufferKirim, pdMS_TO_TICKS(100)) == pdTRUE) {
      udp.beginPacket(laptopIP, laptopPort);
      udp.write((uint8_t*)bufferKirim, sizeof(bufferKirim));
      udp.endPacket();
    }

    // 2. Cek apakah ada perintah balik dari AI Python
    int packetSize = udp.parsePacket();
    if (packetSize) {
      char incomingPacket[255];
      int len = udp.read(incomingPacket, 255);
      if (len > 0) incomingPacket[len] = 0;
      
      String perintah = String(incomingPacket);
      perintah.trim(); 
      
      // ---------------------------------------------------------
      // [DIAGNOSTIK 2]: CEK PERINTAH APA YANG DITERIMA DARI PYTHON
      // ---------------------------------------------------------
      Serial.print("📥 [UDP MASUK] Perintah dari AI: ");
      Serial.println(perintah);
      
      if (millis() - waktuKirimTerakhir >= jedaKirim || perintah == "STOP") {
        if (perintah == "STOP") {
          dataKirim.polaGetar = 0;
          esp_now_send(gelangAddress, (uint8_t *) &dataKirim, sizeof(dataKirim));
        } else if (perintah == "POLA_1") {
          dataKirim.polaGetar = 1;
          esp_now_send(gelangAddress, (uint8_t *) &dataKirim, sizeof(dataKirim));
          waktuKirimTerakhir = millis();
        } else if (perintah == "POLA_2") {
          dataKirim.polaGetar = 2;
          esp_now_send(gelangAddress, (uint8_t *) &dataKirim, sizeof(dataKirim));
          waktuKirimTerakhir = millis(); 
        }
      }
    }
  }
}

// ==========================================
// SETUP
// ==========================================
void setup() {
  Serial.begin(115200);
  delay(2000); 

  analogReadResolution(12);

  WiFi.mode(WIFI_STA);
  Serial.print("\n[*] Menghubungkan ke WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  
  // ---------------------------------------------------------
  // [DIAGNOSTIK 3]: CEK IP DAN PORT SECARA JELAS
  // ---------------------------------------------------------
  Serial.println("\n\n========================================");
  Serial.println("✅ JARINGAN WIFI BERHASIL TERHUBUNG!");
  Serial.println("========================================");
  Serial.print("📡 IP DevKit (Masukkan ke Skrip Python) : ");
  Serial.println(WiFi.localIP());
  Serial.print("🎧 Port Mendengarkan Perintah (boxPort) : ");
  Serial.println(boxPort);
  Serial.print("🎯 Target IP Laptop/PC ML               : ");
  Serial.println(laptopIP);
  Serial.println("========================================\n");

  if (esp_now_init() != ESP_OK) return;

  // Sesuaikan callback ESP-NOW dengan versi board manager
  #if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(4, 4, 0)
    esp_now_register_send_cb((esp_now_send_cb_t)OnDataSent);
  #else
    esp_now_register_send_cb(OnDataSent);
  #endif

  esp_now_peer_info_t peerInfo;
  memset(&peerInfo, 0, sizeof(peerInfo));
  memcpy(peerInfo.peer_addr, gelangAddress, 6);
  peerInfo.channel = 0; 
  peerInfo.encrypt = false;
  
  #if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(4, 4, 0)
    peerInfo.ifidx = WIFI_IF_STA;
  #endif
  
  esp_now_add_peer(&peerInfo);

  // ---------------------------------------------------------
  // PING AWAL: Menguji apakah Gelang C3 menyala dan merespons
  // ---------------------------------------------------------
  Serial.println("[*] Mendaftarkan Gelang C3... Mengirim PING awal...");
  dataKirim.polaGetar = 0; // Kirim perintah kosong (STOP)
  esp_now_send(gelangAddress, (uint8_t *) &dataKirim, sizeof(dataKirim));

  udp.begin(boxPort);

  // Buat antrean untuk menampung maksimal 5 paket data audio (5 x 512)
  antreanAudio = xQueueCreate(5, sizeof(int16_t) * 512);

  // Lempar Tugas Jaringan ke Core 0
  xTaskCreatePinnedToCore(TaskJaringan, "TaskJaringan", 4096, NULL, 1, NULL, 0);

  Serial.println("\n✅ Sistem DUAL-CORE Berjalan! Core 1: Rekam, Core 0: WiFi\n");
}

// ==========================================
// TUGAS CORE 1 (LOOP): KHUSUS MEREKAM AUDIO
// ==========================================
void loop() {
  int16_t audioBuffer[512];
  
  // Rekam 512 sampel tanpa putus
  for(int i = 0; i < 512; i++) {
    unsigned long waktuMulai = micros();
    audioBuffer[i] = analogRead(micPin);
    while(micros() - waktuMulai < 62) { } 
  }

  // Masukkan rekaman ke ruang antrean secepat kilat (0 block time)
  xQueueSend(antreanAudio, &audioBuffer, 0);
}