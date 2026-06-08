import librosa
import numpy as np
import pickle
import sounddevice as sd
from scipy.io.wavfile import write
import os
import time

# ===============================
# KONFIGURASI
# ===============================
DURATION = 3        # detik per rekaman
SAMPLE_RATE = 22050 # sample rate (sama dengan librosa default)
TEMP_FILE = "temp_recording.wav"


# ===============================
# 1. LOAD SEMUA MODEL
# ===============================
print("Loading models...")

with open("cry_detector.pkl", "rb") as f:
    detector = pickle.load(f)
with open("detector_scaler.pkl", "rb") as f:
    detector_scaler = pickle.load(f)
with open("detector_labels.pkl", "rb") as f:
    detector_labels = pickle.load(f)

with open("model.pkl", "rb") as f:
    classifier = pickle.load(f)
with open("scaler.pkl", "rb") as f:
    classifier_scaler = pickle.load(f)
with open("labels.pkl", "rb") as f:
    classifier_labels = pickle.load(f)

print("✓ Semua model siap!\n")


# ===============================
# 2. FEATURE EXTRACTION
# ===============================
def extract_features(file):
    audio, sr = librosa.load(file, duration=3)
    
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=20)
    mfcc_mean = np.mean(mfcc.T, axis=0)
    
    chroma = librosa.feature.chroma_stft(y=audio, sr=sr)
    chroma_mean = np.mean(chroma.T, axis=0)
    
    mel = librosa.feature.melspectrogram(y=audio, sr=sr)
    mel_mean = np.mean(mel.T, axis=0)
    
    features = np.concatenate([mfcc_mean, chroma_mean, mel_mean])
    return features


# ===============================
# 3. RECORD AUDIO DARI MIC
# ===============================
def record_audio(duration=DURATION, sample_rate=SAMPLE_RATE):
    print(f"🎤 Merekam {duration} detik...")
    audio = sd.rec(
        int(duration * sample_rate),
        samplerate=sample_rate,
        channels=1,
        dtype='float32'
    )
    sd.wait()  # tunggu sampai rekaman selesai
    
    # Simpan ke file sementara (librosa bisa baca dari file)
    audio_int16 = (audio * 32767).astype(np.int16)
    write(TEMP_FILE, sample_rate, audio_int16)
    print("✓ Rekaman selesai")


# ===============================
# 4. PIPELINE PREDIKSI 2 TAHAP
# ===============================
def predict_pipeline():
    features = extract_features(TEMP_FILE)
    features = features.reshape(1, -1)
    
    # TAHAP 1: Detector
    features_det = detector_scaler.transform(features)
    det_pred = detector.predict(features_det)[0]
    det_proba = detector.predict_proba(features_det)[0]
    det_label = detector_labels[det_pred]
    det_conf = det_proba[det_pred] * 100
    
    print(f"\n  Tahap 1 (Detektor): {det_label} ({det_conf:.1f}%)")
    
    if det_label == "notcry":
        print("  🔇 BUKAN TANGISAN BAYI - diabaikan")
        return
    
    # TAHAP 2: Classifier
    features_clf = classifier_scaler.transform(features)
    clf_pred = classifier.predict(features_clf)[0]
    clf_proba = classifier.predict_proba(features_clf)[0]
    clf_label = classifier_labels[clf_pred]
    clf_conf = clf_proba[clf_pred] * 100
    
    print(f"  Tahap 2 (Klasifier): {clf_label} ({clf_conf:.1f}%)")
    print(f"  🔔 TANGISAN TERDETEKSI → {clf_label.upper()}")


# ===============================
# 5. MAIN MENU
# ===============================
def menu():
    print("="*50)
    print("🎙️  REAL-TIME BABY CRY DETECTOR")
    print("="*50)
    print("Pilih mode:")
    print("  1. Manual (tekan Enter untuk rekam)")
    print("  2. Continuous (auto rekam tiap 3 detik)")
    print("  3. Keluar")
    print("="*50)
    
    choice = input("Pilih (1/2/3): ").strip()
    return choice


def mode_manual():
    print("\n📌 MODE MANUAL")
    print("Tekan ENTER untuk merekam, atau ketik 'q' untuk keluar.\n")
    
    while True:
        user_input = input("Tekan ENTER untuk rekam (q=keluar): ").strip()
        if user_input.lower() == 'q':
            break
        
        record_audio()
        predict_pipeline()
        print()


def mode_continuous():
    print("\n📌 MODE CONTINUOUS")
    print("Sistem akan terus merekam dan prediksi tiap 3 detik.")
    print("Tekan CTRL+C untuk berhenti.\n")
    
    counter = 1
    try:
        while True:
            print(f"--- Cycle #{counter} ---")
            record_audio()
            predict_pipeline()
            print()
            counter += 1
            time.sleep(0.5)  # jeda kecil antar siklus
    except KeyboardInterrupt:
        print("\n\n⏹️  Dihentikan oleh user")


if __name__ == "__main__":
    while True:
        choice = menu()
        
        if choice == "1":
            mode_manual()
        elif choice == "2":
            mode_continuous()
        elif choice == "3":
            print("Sampai jumpa!")
            break
        else:
            print("Pilihan tidak valid\n")
        
        # Bersihkan file temp
        if os.path.exists(TEMP_FILE):
            os.remove(TEMP_FILE)
