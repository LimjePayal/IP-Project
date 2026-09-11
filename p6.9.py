import cv2
import numpy as np

# ============================================================
# STEP 1: Read damaged image
# ============================================================

img = cv2.imread("cate.jpg")

if img is None:
    print("ERROR: cate.jpg nahi mili!")
    exit()

height, width = img.shape[:2]

print("Image loaded:", width, "x", height)


# ============================================================
# STEP 2: Create mask ONLY for damaged area
# ============================================================

# Black mask initially
mask = np.zeros((height, width), dtype=np.uint8)

# ------------------------------------------------------------
# Damage area - top right
# Image size = 271 x 180
#
# x1, y1 = starting point
# x2, y2 = ending point
# ------------------------------------------------------------

x1 = 195
y1 = 5
x2 = 270
y2 = 100

# Damage area crop
roi = img[y1:y2, x1:x2]

# Convert ROI to grayscale
gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)

# Detect dark/black damaged lines
damage = cv2.inRange(gray_roi, 0, 150)

# Make the detected lines slightly thicker
kernel = np.ones((3, 3), np.uint8)
damage = cv2.dilate(damage, kernel, iterations=1)

# Put ROI mask into complete mask
mask[y1:y2, x1:x2] = damage


# ============================================================
# STEP 3: Save Generated Mask
# ============================================================

cv2.imwrite("mask.jpg", mask)

print("Mask saved: mask.jpg")


# ============================================================
# STEP 4: TELEA Inpainting
# ============================================================

restored_telea = cv2.inpaint(
    img,
    mask,
    3,
    cv2.INPAINT_TELEA
)

cv2.imwrite(
    "restored_telea.png",
    restored_telea
)

print("TELEA saved: restored_telea.png")


# ============================================================
# STEP 5: PREDEFINED MASK
# ============================================================

mask_predefined = cv2.imread(
    "mask.jpg",
    cv2.IMREAD_GRAYSCALE
)

if mask_predefined is None:
    print("ERROR: mask.jpg nahi mili!")
    exit()

# Ensure binary mask
_, mask_predefined = cv2.threshold(
    mask_predefined,
    127,
    255,
    cv2.THRESH_BINARY
)


# ============================================================
# STEP 6: NAVIER-STOKES Inpainting
# ============================================================

restored_ns = cv2.inpaint(
    img,
    mask_predefined,
    3,
    cv2.INPAINT_NS
)

cv2.imwrite(
    "restored_ns.png",
    restored_ns
)

print("Navier-Stokes saved: restored_ns.png")


# ============================================================
# STEP 7: Display Results
# ============================================================

cv2.imshow("Original Damaged Image", img)

cv2.imshow("Generated Mask", mask)

cv2.imshow("Restored - TELEA", restored_telea)

cv2.imshow("Predefined Mask", mask_predefined)

cv2.imshow("Restored - Navier Stokes", restored_ns)

cv2.waitKey(0)
cv2.destroyAllWindows()