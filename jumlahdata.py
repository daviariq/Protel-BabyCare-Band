import os

labels = ["hungry", "tired", "discomfort"]

print("=== JUMLAH FILE PER KELAS ===")
total = 0
for label in labels:
    folder = "dataset/" + label
    files = [f for f in os.listdir(folder) if f.endswith(".wav")]
    print(f"{label:15s} : {len(files)} file")
    total += len(files)

print(f"{'TOTAL':15s} : {total} file")