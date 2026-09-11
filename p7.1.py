import cv2
import os
# ---------- Function to calculate compression ratio ----------
def compression_ratio(original_file, compressed_file):
    Compression Ratio = Original Size / Compressed Size
    original_size = os.path.getsize(original_file)
    compressed_size = os.path.getsize(compressed_file)
    ratio = original_size / compressed_size if compressed_size != 0 else 0
    return ratio, original_size / 1024, compressed_size / 1024
# sizes in KB
# ---------- Load the image ----------
image_path = 'input_image.png/jpg'
# Replace with your file
image = cv2.imread(image_path)
if image is None:
    raise FileNotFoundError("Image not found. Check the path.")
# ---------- LOSSY COMPRESSION (JPEG) ----------
jpeg_quality = 30
lower = higher compression lossy_output = 'compressed_lossy.jpg'
cv2.imwrite(lossy_output, image, [cv2.IMWRITE_JPEG_QUALITY, jpeg_quality])
# ---------- LOSSLESS COMPRESSION (PNG) ----------
png_compression = 90 = none, 9 = max lossless_output = 'compressed_lossless.png'
cv2.imwrite(lossless_output, image, [cv2.IMWRITE_PNG_COMPRESSION, png_compression])
# ---------- Calculate Compression Ratios ----------
lossy_ratio, original_kb, lossy_ kb = compression_ratio(image_path, lossy_output)
lossless_ratio, _, lossless_kb = compression_ratio(image_path, lossless_output)
# ---------- Print Results ----------
print(f"Original Size: {original_kb:.2f} KB")
print(f"Lossy JPEG Size: {lossy_kb:.2f} KB (Quality={jpeg_quality})")
print(f"Lossless PNG Size: {lossless_kb:.2f} KB  (Compression={png_compression})")
print(f"Lossy Compression Ratio: {lossy_ratio:.2f}:1")
print(f"Lossless Compression Ratio: {lossless_ratio:.2f}:1")
# ---------- Display Images ----------
cv2.imshow("Original", image)
cv2.imshow("Lossy JPEG", cv2.imread(lossy_output))
cv2.imshow("Lossless PNG", cv2.imread(lossless_output))
cv2.waitKey(0)
cv2.destroyAllWindows()