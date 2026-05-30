#include "esp_camera.h"
#include <WiFi.h>
#include <WiFiUdp.h>
#include "esp_http_server.h"

// ===========================
// Wi-Fi Configuration
// ===========================
const char* ssid = "PahriPherals";
const char* password = "Zifani2475";

// ===========================
// Microphone & UDP Configuration
// ===========================
const int micPin = 1; // Connect Mic OUT to GPIO 1
const char* laptopIP = "192.168.18.61"; // Match this to your PC's IP
const int laptopPort = 5001; 

WiFiUDP udp;

// --- MIC DIAGNOSTIC VARIABLES ---
unsigned long lastMicCheck = 0;
int micMin = 4095;
int micMax = 0;

// ===========================
// Hardware Pin Definitions 
// ===========================
#define PWDN_GPIO_NUM  -1
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM  15
#define SIOD_GPIO_NUM  4
#define SIOC_GPIO_NUM  5

#define Y9_GPIO_NUM    16
#define Y8_GPIO_NUM    17
#define Y7_GPIO_NUM    18
#define Y6_GPIO_NUM    12
#define Y5_GPIO_NUM    10
#define Y4_GPIO_NUM    8
#define Y3_GPIO_NUM    9
#define Y2_GPIO_NUM    11

#define VSYNC_GPIO_NUM 6
#define HREF_GPIO_NUM  7
#define PCLK_GPIO_NUM  13

httpd_handle_t stream_httpd = NULL;

// ===========================
// MJPEG Stream Handler
// ===========================
#define PART_BOUNDARY "123456789000000000000987654321"
static const char* _STREAM_CONTENT_TYPE = "multipart/x-mixed-replace;boundary=" PART_BOUNDARY;
static const char* _STREAM_BOUNDARY = "\r\n--" PART_BOUNDARY "\r\n";
static const char* _STREAM_PART = "Content-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n";

esp_err_t stream_handler(httpd_req_t *req) {
  camera_fb_t * fb = NULL;
  esp_err_t res = ESP_OK;
  char * part_buf[64];

  res = httpd_resp_set_type(req, _STREAM_CONTENT_TYPE);
  if(res != ESP_OK) return res;

  while(true) {
    fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Camera capture failed");
      res = ESP_FAIL;
    } else {
      size_t hlen = snprintf((char *)part_buf, 64, _STREAM_PART, fb->len);
      res = httpd_resp_send_chunk(req, (const char *)part_buf, hlen);
      if(res == ESP_OK){
        res = httpd_resp_send_chunk(req, (const char *)fb->buf, fb->len);
      }
      if(res == ESP_OK){
        res = httpd_resp_send_chunk(req, _STREAM_BOUNDARY, strlen(_STREAM_BOUNDARY));
      }
      esp_camera_fb_return(fb);
    }
    if(res != ESP_OK) break;
  }
  return res;
}

void startCameraServer() {
  httpd_config_t config = HTTPD_DEFAULT_CONFIG();
  config.server_port = 81; 

  httpd_uri_t stream_uri = {
    .uri       = "/stream", 
    .method    = HTTP_GET,
    .handler   = stream_handler,
    .user_ctx  = NULL
  };

  if (httpd_start(&stream_httpd, &config) == ESP_OK) {
    httpd_register_uri_handler(stream_httpd, &stream_uri);
  }
}

void setup() {
  Serial.begin(115200);
  delay(2000); // OTG USB Delay
  Serial.setDebugOutput(true);
  Serial.println();

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 10000000; // Underclocked for stability
  config.pixel_format = PIXFORMAT_JPEG;
  
  if(psramFound()){
    config.frame_size = FRAMESIZE_VGA;
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }

  // Initialize camera
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("✅ WiFi connected");

  // Start the HTTP stream server
  startCameraServer();

  Serial.print("🎥 Camera Stream Ready! IP: http://");
  Serial.print(WiFi.localIP());
  Serial.println(":81/stream");
}

void loop() {
  // 1. Read analog mic data (0-4095)
  int nilaiAudio = analogRead(micPin);
  
  // 2. Track the lowest and highest peaks for our volume meter
  if (nilaiAudio < micMin) micMin = nilaiAudio;
  if (nilaiAudio > micMax) micMax = nilaiAudio;

  // 3. Send raw data over UDP to Python
  udp.beginPacket(laptopIP, laptopPort);
  udp.print(nilaiAudio);
  udp.endPacket();

  // 4. MICROPHONE DIAGNOSTIC CHECK (Runs only every 500ms)
  unsigned long currentMillis = millis();
  if (currentMillis - lastMicCheck >= 500) {
    int volume = micMax - micMin; // Calculate the actual sound level
    
    Serial.print("🎤 Mic Level: ");
    Serial.print(volume);
    
    // Provide visual feedback
    if (volume <= 10) {
       Serial.println("\t [ERROR: DEAD OR UNPLUGGED]");
    } else if (volume > 2000) {
       Serial.println("\t [LOUD: 🔊🔊🔊]");
    } else {
       Serial.println("\t [ACTIVE: 🔉]");
    }

    // Reset the trackers for the next 500ms window
    micMin = 4095;
    micMax = 0;
    lastMicCheck = currentMillis;
  }

  // 5. 8000 Hz sample rate target
  delayMicroseconds(125); 
}