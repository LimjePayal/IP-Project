#Import the necessary libraries
import cv2
import matplotlib.pyplot as plt
import numpy as np
# Load the image
image = cv2.imread('apple.jpg')
#Plot the original image
plt.subplot(1, 2, 1)
plt.title("Original")
plt.imshow(image)
# Sharpen the image using the Laplacian operator
sharpened_image2 = cv2.Laplacian(image, cv2.CV_64F)
#Save the image
cv2.imwrite('Laplacian sharpened_image.jpg', sharpened_image2)
#Plot the sharpened image
plt.subplot(1, 2, 2)
plt.title("Laplacian Sharpening")
plt.imshow(sharpened_image2)
plt.show()