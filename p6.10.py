import cv2
import numpy as np
import matplotlib.pyplot as plt


# ============================================================
# Step 1: Read the damaged image
# ============================================================

damaged_img = cv2.imread("cate.jpg")

if damaged_img is None:
    print("ERROR: cate.jpg nahi mili!")
    exit()

height, width = damaged_img.shape[:2]


# ============================================================
# Step 2: Create mask automatically
# ============================================================

# Black mask
mask_auto_gray = np.zeros((height, width), dtype=np.uint8)


# ------------------------------------------------------------
# Aapki image mein damage TOP-RIGHT side mein hai
# ------------------------------------------------------------

x1 = 195
y1 = 0
x2 = width
y2 = 100

# Damage region
roi = damaged_img[y1:y2, x1:x2]

# Convert ROI to grayscale
gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)


# ------------------------------------------------------------
# Dark/black damaged pixels detect
# ------------------------------------------------------------

mask_roi = cv2.inRange(
    gray_roi,
    0,
    180
)


# ------------------------------------------------------------
# Damage ke gaps fill karo
# ------------------------------------------------------------

kernel_close = np.ones((5, 5), np.uint8)

mask_roi = cv2.morphologyEx(
    mask_roi,
    cv2.MORPH_CLOSE,
    kernel_close,
    iterations=2
)


# ------------------------------------------------------------
# Mask ko thoda bada karo
# Taaki damage ka edge bhi remove ho
# ------------------------------------------------------------

kernel_dilate = np.ones((5, 5), np.uint8)

mask_roi = cv2.dilate(
    mask_roi,
    kernel_dilate,
    iterations=2
)


# Put ROI mask into complete image
mask_auto_gray[y1:y2, x1:x2] = mask_roi


# ============================================================
# Step 3: Save generated mask
# ============================================================

cv2.imwrite(
    "mask.jpg",
    mask_auto_gray
)

print("Generated mask saved as mask.jpg")


# ============================================================
# Step 4: Restore with TELEA
# ============================================================

restored_telea = cv2.inpaint(
    damaged_img,
    mask_auto_gray,
    7,
    cv2.INPAINT_TELEA
)

cv2.imwrite(
    "restored_telea.png",
    restored_telea
)

print("Restored TELEA saved as restored_telea.png")


# ============================================================
# Step 5: Read PREDEFINED MASK
# ============================================================

mask_predefined = cv2.imread(
    "mask.jpg",
    cv2.IMREAD_GRAYSCALE
)

if mask_predefined is None:
    print("ERROR: mask.jpg nahi mili!")
    exit()


# Make sure mask is binary
_, mask_predefined = cv2.threshold(
    mask_predefined,
    127,
    255,
    cv2.THRESH_BINARY
)


# ============================================================
# Step 6: Restore with Navier-Stokes
# ============================================================

restored_ns = cv2.inpaint(
    damaged_img,
    mask_predefined,
    7,
    cv2.INPAINT_NS
)

cv2.imwrite(
    "restored_ns.png",
    restored_ns
)

print("Restored Navier-Stokes saved as restored_ns.png")


# ============================================================
# Step 7: Display results using Matplotlib
# ============================================================

images = [
    damaged_img,
    mask_auto_gray,
    restored_telea,
    restored_ns
]

titles = [
    "Original Damaged",
    "Generated Mask",
    "Restored (TELEA)",
    "Restored (Navier-Stokes)"
]


plt.figure(figsize=(12, 8))


for i in range(4):

    plt.subplot(2, 2, i + 1)

    if len(images[i].shape) == 2:
        # Mask
        plt.imshow(
            images[i],
            cmap="gray"
        )

    else:
        # BGR to RGB
        plt.imshow(
            cv2.cvtColor(
                images[i],
                cv2.COLOR_BGR2RGB
            )
        )

    plt.title(titles[i])
    plt.axis("off")


plt.tight_layout()
plt.show()