// ==========================================
// BABYCARE BAND - RECEIVER GELANG (FINAL)
// Board: ESP32C3 Dev Module
// ==========================================

#include <WiFi.h>
#include <esp_now.h>

// ⚠️ SAMAKAN WIFI DENGAN GATEWAY S3
const char* ssid     = "PahriPherals";
const char* password = "Zifani2475";

// ✅ PIN MOTOR SUDAH DIPINDAH KE PIN 3
const int motorPin = 3; 

int polaAktif = 0;
unsigned long waktuSebelumnya = 0;

typedef struct struct_message {
  int polaGetar; 
} struct_message;

struct_message dataTerima;

// Fungsi saat menerima sinyal
void OnDataRecv(const esp_now_recv_info_t *info, const uint8_t *incomingData, int len) {
  memcpy(&dataTerima, incomingData, sizeof(dataTerima));
  
  Serial.print("➔ Menerima Instruksi Pola: POLA_");
  Serial.println(dataTerima.polaGetar);
  
  polaAktif = dataTerima.polaGetar;
  waktuSebelumnya = millis(); 
  
  if (polaAktif == 0) {
    digitalWrite(motorPin, LOW); 
  }
}

void setup() {
  Serial.begin(115200);
  delay(3000); 
  
  pinMode(motorPin, OUTPUT);
  digitalWrite(motorPin, LOW); 

  // KONEK WIFI (Agar Channel S3 & C3 Sinkron 100%)
  WiFi.mode(WIFI_STA);
  Serial.print("Menyelaraskan Channel Wi-Fi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ Channel Tersinkronisasi!");

  // INISIALISASI ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("❌ Error inisialisasi ESP-NOW");
    return;
  }
  
  esp_now_register_recv_cb(OnDataRecv);
  Serial.println("✅ Gelang Standby. Menunggu sinyal...");
}

void loop() {
  unsigned long waktuSekarang = millis();

  // POLA 1: TANGISAN PERLU PERHATIAN 
  if (polaAktif == 1) {
    if (waktuSekarang - waktuSebelumnya < 5000) { 
      int siklus = (waktuSekarang - waktuSebelumnya) % 1000;
      if (siklus < 600) {
        digitalWrite(motorPin, HIGH); 
      } else {
        digitalWrite(motorPin, LOW);
      }
    } else {
      polaAktif = 0; 
      digitalWrite(motorPin, LOW);
    }
  }
  
  // POLA 2: TANGISAN LELAH / NGANTUK
  else if (polaAktif == 2) {
    if (waktuSekarang - waktuSebelumnya < 4000) { 
      int siklus = (waktuSekarang - waktuSebelumnya) % 300;
      if (siklus < 150) {
        digitalWrite(motorPin, HIGH);
      } else {
        digitalWrite(motorPin, LOW);
      }
    } else {
      polaAktif = 0; 
      digitalWrite(motorPin, LOW);
    }
  }
  
  else {
    digitalWrite(motorPin, LOW);
  }
}