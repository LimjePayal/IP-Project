import cv2
import numpy as np
image1 = cv2.imread('sungrek.png')
image2 = cv2.imread('Tiger.png')
weightedSum = cv2.addWeighted(image1, 0.8, image2, 0.7, 0)
cv2.imshow('Weighted Image', weightedSum)
if cv2.waitKey(0) & 0xff == 27:
    cv2.destroyAllWindows()