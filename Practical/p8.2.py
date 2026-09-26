import cv2
import numpy as np
# ---------- Load binary image ----------
image_path 'C:\\Users\\LAB-005\\PycharmProjects\\PythonProject\\payal\\photo.jpg'
# Replace with your binary image
image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
if image is None:
    raise FileNotFoundError("Image not found. Check the path.")
# ---------- Ensure binary ----------,
binary = cv2.threshold(image, 127, 255, cv2.THRESH_BINARY)
# ---------- Define structuring element ----------
kernel_size = (5, 5) kernel = cv2.getStructuringElement(cv2.MORPH_RECT, kernel_size)
# ---------- Morphological Operations ----------
morph_ops = {      "Erosion": cv2.erode(binary, kernel, iterations=1),
                   "Dilation": cv2.dilate(binary, kernel, iterations=1),
                   "Opening": cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel),
                   "Closing": cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel) }
# ---------- Function to calculate area of objects ----------
def calculate_object_areas(binary_img):
    contours, _ = cv2.findContours(binary_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    areas = [cv2.contourArea(c) for c in contours]
    return areas, contours
# ---------- Analyze and display each operation ----------
for op_name, op_img in morph_ops.items():
    areas, contours = calculate_object_areas(op_img)
    print(f"{op_name}: Number of objects = {len(areas)}, Areas = {areas}")
# Draw contours on a copy for visualization
contoured_img = cv2.cvtColor(op_img, cv2.COLOR_GRAY2BGR)
cv2.drawContours(contoured_img, contours, -1, (0, 0, 255), 2)
cv2.imshow(f"{op_name} with Contours", contoured_img)
# ---------- Display original ----------
cv2.imshow("Original Binary", binary)
cv2.waitKey(0)
cv2.destroyAllWindows()