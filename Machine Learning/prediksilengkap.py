import librosa
import numpy as np
import pickle
import sys
import os

# ===============================
# 1. LOAD SEMUA MODEL
# ===============================
print("Loading models...")

# Model 1: Detector (cry vs notcry)
with open("cry_detector.pkl", "rb") as f:
    detector = pickle.load(f)
with open("detector_scaler.pkl", "rb") as f:
    detector_scaler = pickle.load(f)
with open("detector_labels.pkl", "rb") as f:
    detector_labels = pickle.load(f)

# Model 2: Classifier (need_attention vs tired)
with open("model.pkl", "rb") as f:
    classifier = pickle.load(f)
with open("scaler.pkl", "rb") as f:
    classifier_scaler = pickle.load(f)
with open("labels.pkl", "rb") as f:
    classifier_labels = pickle.load(f)

print("✓ Semua model siap!\n")


# ===============================
# 2. FEATURE EXTRACTION (sama untuk kedua model)
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
# 3. PIPELINE PREDIKSI 2 TAHAP
# ===============================
def predict_full(audio_path):
    if not os.path.exists(audio_path):
        print(f"❌ File tidak ditemukan: {audio_path}")
        return
    
    print(f"📂 File: {audio_path}")
    print("🔍 Memproses audio...\n")
    
    # Ekstrak fitur sekali (dipakai kedua model)
    features = extract_features(audio_path)
    features = features.reshape(1, -1)
    
    # ---------- TAHAP 1: DETEKSI ----------
    print("="*45)
    print("TAHAP 1: Deteksi tangisan")
    print("="*45)
    
    features_det = detector_scaler.transform(features)
    det_pred = detector.predict(features_det)[0]
    det_proba = detector.predict_proba(features_det)[0]
    det_label = detector_labels[det_pred]
    det_conf = det_proba[det_pred] * 100
    
    print(f"Hasil      : {det_label}")
    print(f"Confidence : {det_conf:.2f}%")
    
    # Kalau BUKAN tangisan, stop di sini
    if det_label == "notcry":
        print("\n" + "="*45)
        print("🔇 HASIL AKHIR: BUKAN TANGISAN BAYI")
        print("   Suara diabaikan, tidak ada notifikasi.")
        print("="*45)
        return
    
    # ---------- TAHAP 2: KLASIFIKASI ----------
    print("\n" + "="*45)
    print("TAHAP 2: Klasifikasi jenis tangisan")
    print("="*45)
    
    features_clf = classifier_scaler.transform(features)
    clf_pred = classifier.predict(features_clf)[0]
    clf_proba = classifier.predict_proba(features_clf)[0]
    clf_label = classifier_labels[clf_pred]
    clf_conf = clf_proba[clf_pred] * 100
    
    print(f"Jenis      : {clf_label}")
    print(f"Confidence : {clf_conf:.2f}%")
    print("\nDetail probabilitas:")
    for idx, prob in enumerate(clf_proba):
        name = classifier_labels[idx]
        print(f"  - {name:18s}: {prob*100:.2f}%")
    
    # ---------- HASIL AKHIR ----------
    print("\n" + "="*45)
    print("🔔 HASIL AKHIR: TANGISAN TERDETEKSI")
    print(f"   Jenis kebutuhan: {clf_label.upper()}")
    print("="*45)


# ===============================
# 4. MAIN
# ===============================
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("⚠️  Cara pakai: python prediksilengkap.py <file_audio.wav>")
        print("   Contoh: python prediksilengkap.py datasetdetector/cry/hungry_xxx.wav")
        sys.exit(1)
    
    predict_full(sys.argv[1])
