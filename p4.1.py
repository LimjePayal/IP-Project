import OpencV
import cv2
# Read the image in grayscale (0) or color (1)
img = cv2.imread('neg.png', 0)
# Change 0 to 1 for color
# Create the negative image
negative = 255 - img
# Show original and negative side-by-side import numpy as
np combined = np.hstack((img, negative))
cv2.imshow('Original (Left) vs Negative (Right)', combined)
cv2.waitKey(0)
cv2.destroyAllWindows()