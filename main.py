import librosa
import numpy as np
import os

from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler

# ===============================
# 1. FEATURE EXTRACTION
# ===============================
def extract_features(file):
    # Load audio (3 detik pertama)
    audio, sr = librosa.load(file, duration=3)
    
    # Fitur 1: MFCC (karakter "warna" suara - 20 angka)
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=20)
    mfcc_mean = np.mean(mfcc.T, axis=0)
    
    # Fitur 2: Chroma (karakter "nada" suara - 12 angka)
    chroma = librosa.feature.chroma_stft(y=audio, sr=sr)
    chroma_mean = np.mean(chroma.T, axis=0)
    
    # Fitur 3: Mel Spectrogram (energi suara di tiap frekuensi - 128 angka)
    mel = librosa.feature.melspectrogram(y=audio, sr=sr)
    mel_mean = np.mean(mel.T, axis=0)
    
    # Gabungkan semua fitur jadi 1 vektor besar (20+12+128 = 160 angka)
    features = np.concatenate([mfcc_mean, chroma_mean, mel_mean])
    
    return features


# ===============================
# 2. LOAD DATASET (3 KELAS SAJA jadi 2)
# ===============================
X = []
y = []

labels = {
    "hungry": 0,
    "discomfort": 0,   # digabung dengan hungry
    "tired": 1
}

for label in labels:
    folder = "dataset/" + label

    if not os.path.exists(folder):
        print("Folder tidak ditemukan:", folder)
        continue

    for file in os.listdir(folder):

        if not file.endswith(".wav"):
            continue

        path = os.path.join(folder, file)

        try:
            features = extract_features(path)
            X.append(features)
            y.append(labels[label])
        except:
            print("Error:", path)

print("Total data:", len(X))


# ===============================
# 3. PREPROCESSING
# ===============================
X = np.array(X)
y = np.array(y)

scaler = StandardScaler()
X = scaler.fit_transform(X)


# ===============================
# 4. SPLIT DATA
# ===============================
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Data training:", len(X_train))
print("Data testing:", len(X_test))


# ===============================
# 5. MODEL
# ===============================
n_perlu_perhatian = sum(y_train == 0)
n_mengantuk = sum(y_train == 1)
scale_pos_weight = n_perlu_perhatian / n_mengantuk

model = XGBClassifier(
    n_estimators=300,
    max_depth=8,
    learning_rate=0.1,
    scale_pos_weight=scale_pos_weight,  # atasi imbalance
    random_state=42,
    n_jobs=-1,
    eval_metric='logloss'
)
# ===============================
# 6. TRAINING
# ===============================
print("Training model...")
model.fit(X_train, y_train)


# ===============================
# 7. TESTING
# ===============================
y_pred = model.predict(X_test)

acc = accuracy_score(y_test, y_pred)
print("Akurasi:", acc)


# ===============================
# 8. DETAIL HASIL (OPSIONAL)
# ===============================
from sklearn.metrics import classification_report

print("\nDetail klasifikasi:")
print(classification_report(y_test, y_pred))

# ===============================
# 9. CONFUSION MATRIX
# ===============================
from sklearn.metrics import confusion_matrix

print("\nConfusion Matrix:")
print("Baris = label sebenarnya, Kolom = prediksi model")
print("Urutan: [hungry, tired, discomfort]")
print()

cm = confusion_matrix(y_test, y_pred)

label_names = ["need_attention", "tired"]
print(f"{'':18s} {'need_attention':>18s} {'tired':>12s}")
for i, name in enumerate(label_names):
    row = cm[i]
    print(f"{name:18s} {row[0]:>18d} {row[1]:>12d}")

    # ===============================
# 10. SIMPAN MODEL & SCALER
# ===============================
import pickle

# Simpan model XGBoost
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)
print("\n✓ Model disimpan ke: model.pkl")

# Simpan scaler
with open("scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)
print("✓ Scaler disimpan ke: scaler.pkl")

# Simpan label mapping
label_mapping = {
    0: "need_attention",
    1: "tired"
}
with open("labels.pkl", "wb") as f:
    pickle.dump(label_mapping, f)
print("✓ Labels disimpan ke: labels.pkl")

print("\n✅ Semua file siap! Sekarang bisa lanjut ke deployment.")