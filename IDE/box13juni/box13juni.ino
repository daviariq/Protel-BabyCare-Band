// ==========================================
// BABYCARE BAND - TRANSMITTER BOX (GATEWAY)
// Board: ESP32S3 Dev Module (Tanpa Kamera)
// ==========================================

#include <WiFi.h>
#include <WiFiUdp.h>
#include <esp_now.h>

// ==========================================
// ⚠️ 1. UBAH BAGIAN INI SESUAI WIFI KAMU!
// ==========================================
const char* ssid     = "PahriPherals";      // Contoh: "PahriPherals"
const char* password = "Zifani2475";       // Contoh: "Zifani2475"

// Target IP Laptop (Pastikan IP laptop yang menjalankan Python adalah ini)
const char* laptopIP = "192.168.18.12";       
const int laptopPort = 5001;                  
const int boxPort    = 5000;                  

// ==========================================
// 2. MAC ADDRESS GELANG (Sudah Terkunci!)
// ==========================================
uint8_t gelangAddress[] = {0xA0, 0xF2, 0x62, 0xA5, 0x43, 0xEC};

// --- PIN & VARIABEL ---
const int micPin = 4; // Terhubung ke OUT MAX9814
WiFiUDP udp;

typedef struct struct_message {
  int polaGetar; 
} struct_message;

struct_message dataKirim;

// Timer anti-spam
unsigned long waktuKirimTerakhir = 0;
const int jedaKirim = 3000; 

// --- FUNGSI CALLBACK ESP-NOW (S3 ke C3) ---
void OnDataSent(const esp_now_send_info_t *info, esp_now_send_status_t status) {
  if (status == ESP_NOW_SEND_SUCCESS) {
    Serial.println("➔ Sinyal ESP-NOW terkirim ke Gelang!");
  } else {
    Serial.println("➔ GAGAL mengirim ke Gelang");
  }
}

void setup() {
  Serial.begin(115200);
  delay(3000); 

  analogReadResolution(12); // Resolusi ADC 0-4095

  // 1. KONEK WIFI (Wajib Mode Station untuk ESP-NOW + WiFi)
  WiFi.mode(WIFI_STA);
  Serial.print("Konek WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi OK! IP Box S3: " + WiFi.localIP().toString());

  // 2. INISIALISASI ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("❌ ESP-NOW Gagal diinisialisasi");
    return;
  }
  esp_now_register_send_cb(OnDataSent);

  // Mendaftarkan Gelang dengan aturan ESP32 Core v3.x
  esp_now_peer_info_t peerInfo;
  memset(&peerInfo, 0, sizeof(peerInfo)); // Wajib bersihkan memori
  
  memcpy(peerInfo.peer_addr, gelangAddress, 6);
  peerInfo.channel = 0; 
  peerInfo.encrypt = false;
  peerInfo.ifidx = WIFI_IF_STA; // Paksa ESP-NOW pakai jalur WiFi Station
  
  if (esp_now_add_peer(&peerInfo) != ESP_OK){
    Serial.println("❌ Gagal mendaftarkan Gelang");
    return;
  }
  Serial.println("✅ Gelang A0:F2:62:A5:43:EC Berhasil Didaftarkan.");

  // 3. MULAI UDP
  udp.begin(boxPort);
  Serial.println("✅ Sistem S3 Gateway Berjalan... Membaca Mic!\n");
}

void loop() {
  // ==========================================
  // BAGIAN A: REKAM 512 SAMPEL & TEMBAK (BINER)
  // Target: 16000 Hz (Jeda ~62 mikrodetik)
  // ==========================================
  int16_t audioBuffer[512]; 

  for(int i = 0; i < 512; i++) {
    audioBuffer[i] = analogRead(micPin);
    delayMicroseconds(62); // Update dari 125us ke 62us untuk 16kHz
  }

  // Tembak paket biner mentah (1024 bytes) ke Python
  udp.beginPacket(laptopIP, laptopPort);
  udp.write((uint8_t*)audioBuffer, sizeof(audioBuffer));
  udp.endPacket();

  // ==========================================
  // BAGIAN B: TERIMA PERINTAH BALIK DARI LAPTOP
  // ==========================================
  int packetSize = udp.parsePacket();
  if (packetSize) {
    char incomingPacket[255];
    int len = udp.read(incomingPacket, 255);
    if (len > 0) incomingPacket[len] = 0; 
    
    String perintah = String(incomingPacket);
    perintah.trim(); 
    
    // Bypass timer kalau perintahnya STOP
    if (millis() - waktuKirimTerakhir >= jedaKirim || perintah == "STOP") {
      
      if (perintah == "STOP") {
        Serial.println("🛑 [LAPTOP] Instruksi STOP -> Matikan Gelang!");
        dataKirim.polaGetar = 0;
        esp_now_send(gelangAddress, (uint8_t *) &dataKirim, sizeof(dataKirim));
      } 
      else if (perintah == "POLA_1") {
        Serial.println("⚠️ [LAPTOP] Tangisan (Lapar) -> Tembak POLA 1");
        dataKirim.polaGetar = 1;
        esp_now_send(gelangAddress, (uint8_t *) &dataKirim, sizeof(dataKirim));
        waktuKirimTerakhir = millis(); 
      }
      else if (perintah == "POLA_2") {
        Serial.println("⚠️ [LAPTOP] Tangisan (Lelah/Gelisah) -> Tembak POLA 2");
        dataKirim.polaGetar = 2;
        esp_now_send(gelangAddress, (uint8_t *) &dataKirim, sizeof(dataKirim));
        waktuKirimTerakhir = millis(); 
      }
    }
  }
}