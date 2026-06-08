import os
import shutil
import pandas as pd

# ===============================
# KONFIGURASI PATH
# ===============================
# Lokasi ESC-50 (sesuaikan kalau beda)
ESC50_AUDIO = r"C:\Users\Davi Ariq\Downloads\ESC-50-master\ESC-50-master\audio"
ESC50_CSV   = r"C:\Users\Davi Ariq\Downloads\ESC-50-master\ESC-50-master\meta\esc50.csv"

# Folder dataset tangisan
KAGGLE_FOLDERS = ["dataset/hungry", "dataset/tired", "dataset/discomfort"]

# Folder tujuan (tanpa underscore, sesuai folder kamu)
DEST_CRY     = "datasetdetector/cry"
DEST_NOT_CRY = "datasetdetector/notcry"

# Buat folder tujuan otomatis kalau belum ada
os.makedirs(DEST_CRY, exist_ok=True)
os.makedirs(DEST_NOT_CRY, exist_ok=True)
print("Folder tujuan siap")

# ===============================
# 1. COPY TANGISAN → cry
# ===============================
print("=== MENYIAPKAN FOLDER CRY ===")
count_cry = 0
for folder in KAGGLE_FOLDERS:
    if not os.path.exists(folder):
        print(f"⚠️  Folder tidak ada: {folder}")
        continue
    for file in os.listdir(folder):
        if file.endswith(".wav"):
            src = os.path.join(folder, file)
            # Beri prefix nama folder asal supaya tidak ada nama bentrok
            prefix = folder.split("/")[-1]
            dst = os.path.join(DEST_CRY, f"{prefix}_{file}")
            shutil.copy(src, dst)
            count_cry += 1
print(f"✓ Total file cry: {count_cry}")


# ===============================
# 2. COPY SUARA NON-BAYI  → not_cry
# ===============================
print("\n=== MENYIAPKAN FOLDER NOT_CRY ===")

# Baca CSV daftar kategori
df = pd.read_csv(ESC50_CSV)

# Buang baris berkategori crying_baby
df_not_cry = df[df["category"] != "crying_baby"]

print(f"Total file ESC-50         : {len(df)}")
print(f"File crying_baby (dibuang): {len(df) - len(df_not_cry)}")
print(f"File not_cry (dipakai)    : {len(df_not_cry)}")

count_not_cry = 0
for filename in df_not_cry["filename"]:
    src = os.path.join(ESC50_AUDIO, filename)
    dst = os.path.join(DEST_NOT_CRY, filename)
    if os.path.exists(src):
        shutil.copy(src, dst)
        count_not_cry += 1
print(f"✓ Total file not_cry: {count_not_cry}")


# ===============================
# RINGKASAN
# ===============================
print("\n" + "="*40)
print("SELESAI!")
print(f"  cry     : {count_cry} file")
print(f"  not_cry : {count_not_cry} file")
print("="*40)
