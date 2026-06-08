import librosa
import numpy as np
import os
import pickle

from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler

# ===============================
# 1. FEATURE EXTRACTION (sama dengan main.py)
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
# 2. LOAD DATASET DETECTOR
# ===============================
X = []
y = []

# 0 = cry (tangisan), 1 = notcry (bukan tangisan)
labels = {
    "cry": 0,
    "notcry": 1
}

for label in labels:
    folder = "datasetdetector/" + label

    if not os.path.exists(folder):
        print("Folder tidak ditemukan:", folder)
        continue

    files = os.listdir(folder)
    print(f"Loading {label}... ({len(files)} files)")

    for file in files:
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
# 5. MODEL (dengan class balancing)
# ===============================
n_cry = sum(y_train == 0)
n_notcry = sum(y_train == 1)
scale_pos_weight = n_cry / n_notcry

model = XGBClassifier(
    n_estimators=300,
    max_depth=8,
    learning_rate=0.1,
    scale_pos_weight=scale_pos_weight,
    random_state=42,
    n_jobs=-1,
    eval_metric='logloss'
)


# ===============================
# 6. TRAINING
# ===============================
print("Training detector model...")
model.fit(X_train, y_train)


# ===============================
# 7. TESTING
# ===============================
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print("Akurasi:", acc)

print("\nDetail klasifikasi:")
print(classification_report(y_test, y_pred))

print("Confusion Matrix:")
print("Urutan: [cry, notcry]")
cm = confusion_matrix(y_test, y_pred)
label_names = ["cry", "notcry"]
print(f"{'':10s} {'cry':>8s} {'notcry':>8s}")
for i, name in enumerate(label_names):
    row = cm[i]
    print(f"{name:10s} {row[0]:>8d} {row[1]:>8d}")


# ===============================
# 8. SIMPAN MODEL
# ===============================
with open("cry_detector.pkl", "wb") as f:
    pickle.dump(model, f)
print("\n✓ Model disimpan ke: cry_detector.pkl")

with open("detector_scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)
print("✓ Scaler disimpan ke: detector_scaler.pkl")

detector_labels = {
    0: "cry",
    1: "notcry"
}
with open("detector_labels.pkl", "wb") as f:
    pickle.dump(detector_labels, f)
print("✓ Labels disimpan ke: detector_labels.pkl")

print("\n✅ Detector model siap digunakan!")
