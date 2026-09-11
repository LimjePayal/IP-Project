# import Opencv
import cv2
# import Numpy
import numpy as np
# import Matplotlib
import matplotlib.pyplot as plt
# read a image using imread
img = cv2.imread('tomato.png', 0)
# grayscale  # creating a Histograms Equalization
equ = cv2.equalizeHist(img)
# stacking images side-by-side
res = np.hstack((img, equ))
# show image input vs output
cv2.imshow('Original vs Equalized', res)
# Plotting histograms
plt.figure(figsize=(10, 5))
# Original image histogram
plt.subplot(1, 2, 1)
plt.hist(img.ravel(), 256, [0, 256], color='blue')
plt.title('Original Histogram')
plt.xlabel('Pixel Intensity')
plt.ylabel('Frequency')
# Equalized image histogram
plt.subplot(1, 2, 2)
plt.hist(equ.ravel(), 256, [0, 256], color='green')
plt.title('Equalized Histogram')
plt.xlabel('Pixel Intensity')
plt.ylabel('Frequency')
plt.tight_layout()
plt.show()
cv2.waitKey(0)
cv2.destroyAllWindows()