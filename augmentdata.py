import os
import librosa
import soundfile as sf
import numpy as np
from audiomentations import (
    Compose, AddGaussianNoise, TimeStretch, PitchShift, Shift, Gain
)

# ===============================
# KONFIGURASI
# ===============================
# Berapa file augmented per file asli
N_AUGMENTED_PER_FILE = 2

# Folder sumber dan tujuan
SOURCE_FOLDERS = {
    "dataset/hungry": "dataset/hungry",
    "dataset/discomfort": "dataset/discomfort",
    "dataset/tired": "dataset/tired",
    "datasetdetector/cry": "datasetdetector/cry",
    "datasetdetector/notcry": "datasetdetector/notcry"
}


# ===============================
# AUGMENTATION PIPELINE
# ===============================
augment = Compose([
    AddGaussianNoise(min_amplitude=0.001, max_amplitude=0.015, p=0.7),
    TimeStretch(min_rate=0.85, max_rate=1.15, p=0.5),
    PitchShift(min_semitones=-3, max_semitones=3, p=0.5),
    Shift(min_shift=-0.2, max_shift=0.2, p=0.5),
    Gain(min_gain_db=-6, max_gain_db=6, p=0.5),
])


# ===============================
# PROSES AUGMENTASI
# ===============================
def augment_folder(folder, target_folder):
    if not os.path.exists(folder):
        print(f"⚠️  Folder tidak ada: {folder}")
        return 0
    
    files = [f for f in os.listdir(folder) if f.endswith(".wav")]
    
    # Skip file yang sudah hasil augmentasi (kalau dijalankan ulang)
    original_files = [f for f in files if not f.startswith("aug")]
    
    print(f"\n📂 {folder}")
    print(f"   File asli: {len(original_files)}")
    
    count = 0
    for i, file in enumerate(original_files):
        src_path = os.path.join(folder, file)
        
        try:
            # Load audio
            audio, sr = librosa.load(src_path, sr=22050, duration=3)
            
            # Generate N versi augmented
            for j in range(N_AUGMENTED_PER_FILE):
                augmented = augment(samples=audio, sample_rate=sr)
                
                # Simpan dengan prefix "aug"
                new_filename = f"aug{j+1}_{file}"
                new_path = os.path.join(target_folder, new_filename)
                sf.write(new_path, augmented, sr)
                count += 1
            
            # Progress indicator
            if (i + 1) % 100 == 0:
                print(f"   Progress: {i+1}/{len(original_files)} files processed")
        
        except Exception as e:
            print(f"   ⚠️  Error pada {file}: {e}")
    
    print(f"   ✓ Generated: {count} file augmented")
    return count


# ===============================
# MAIN
# ===============================
print("="*50)
print("🎵 DATA AUGMENTATION")
print("="*50)
print(f"Generating {N_AUGMENTED_PER_FILE} augmented versions per file")
print("Augmentations: noise + time stretch + pitch shift + shift + gain")
print("="*50)

total = 0
for source, target in SOURCE_FOLDERS.items():
    total += augment_folder(source, target)

print("\n" + "="*50)
print(f"✅ SELESAI! Total {total} file augmented dihasilkan")
print("="*50)