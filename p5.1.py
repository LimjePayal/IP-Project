import cv2
import numpy as np
# Read the input image
img = cv2.imread("salad1.png")
# Check if image was loaded successfully if img is None:
print("Error: Image not found or path is incorrect.")
exit()
# Apply averaging (blur) filter
im1 = cv2.blur(img,(5, 5))
# Apply box filter (with normalization)
im2 = cv2.boxFilter(img,-1,(2, 2),normalize=True)
# Display both filtered images side by side
cv2.imshow('Blurred (5x5) vs Box Filter (2x2)', np.hstack((im1, im2)))
# Wait for key press and close window
cv2.waitKey(0);
cv2.destroyAllWindows();