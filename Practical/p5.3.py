import cv2
image = cv2.imread('flower.png’)
kernel_size = 5
noiseless_image = cv2.medianBlur(image,kernel_size)
cv2.imshow('CS24219 Original Image', image)
cv2.imshow('CS24219 Noiseless Image(Median Filtered)’,noiseless_image)
cv2.waitKey(0)
cv2.destroyAllWindows()