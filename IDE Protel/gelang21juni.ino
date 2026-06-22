#include <WiFi.h>
#include <esp_now.h>

#define MOTOR_PIN 3 

// Masukkan WiFi yang sama dengan DevKit agar Channel Radio-nya sinkron!
const char* ssid = "Mi11Lite";
const char* password = "Zifani2475";

typedef struct struct_message {
    int polaGetar;
} struct_message;

struct_message pesanMasuk;
int statusPola = 0; 
unsigned long waktuSebelumnya = 0;
bool stateMotor = false;

// Format Callback ESP32 v3.x (Wajib pakai esp_now_recv_info)
void OnDataRecv(const esp_now_recv_info * info, const uint8_t *incomingData, int len) {
  memcpy(&pesanMasuk, incomingData, sizeof(pesanMasuk));
  statusPola = pesanMasuk.polaGetar;
  
  Serial.print("📥 [ESP-NOW] Instruksi Masuk: POLA ");
  Serial.println(statusPola);

  if (statusPola == 0) {
    digitalWrite(MOTOR_PIN, LOW); 
    stateMotor = false;
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(MOTOR_PIN, OUTPUT); 
  digitalWrite(MOTOR_PIN, LOW);
  
  // 1. KONEKSIKAN KE WIFI AGAR CHANNEL SINKRON DENGAN DEVKIT
  WiFi.mode(WIFI_STA);
  Serial.print("[*] Menghubungkan ke WiFi untuk sinkronisasi Channel...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  
  Serial.println("\n✅ WiFi Terhubung! Channel Radio sudah sinkron.");
  
  // 2. TAMPILKAN MAC ADDRESS ASLI
  Serial.println("========================================");
  Serial.print("⚠️ MAC ADDRESS GELANG INI : ");
  Serial.println(WiFi.macAddress());
  Serial.println("========================================");

  if (esp_now_init() == ESP_OK) {
    esp_now_register_recv_cb(OnDataRecv);
    Serial.println("✅ Gelang C3 Aktif. Menunggu Tembakan ESP-NOW...");
  } else {
    Serial.println("❌ Gagal inisialisasi ESP-NOW!");
  }
}

void loop() {
  unsigned long waktuSekarang = millis();

  if (statusPola == 1) {
    if (waktuSekarang - waktuSebelumnya >= 1000) {
      waktuSebelumnya = waktuSekarang;
      stateMotor = !stateMotor; 
      digitalWrite(MOTOR_PIN, stateMotor);
    }
  } 
  else if (statusPola == 2) {
    if (waktuSekarang - waktuSebelumnya >= 200) {
      waktuSebelumnya = waktuSekarang;
      stateMotor = !stateMotor;
      digitalWrite(MOTOR_PIN, stateMotor);
    }
  }
  else {
    digitalWrite(MOTOR_PIN, LOW); 
  }
}