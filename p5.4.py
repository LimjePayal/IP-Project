import cv2
import numpy as np
# Load the image
img = cv2.imread("art.png")
# Check if image is loaded properly if img is None:
print("Error: Image not found or path is incorrect.")
exit()
# Apply bilateral filter
d = 9, sigmaColor = 75, sigmaSpace = 75, dst = cv2.bilateralFilter(img, 9, 75, 75)
# Display original and filtered image side by side
cv2.imshow('Original vs Bilateral Filter', np.hstack((img, dst)))
# Wait for a key press and close the window
cv2.waitKey(0)
cv2.destroyAllWindows()